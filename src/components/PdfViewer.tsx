import { useCallback, useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'
import { XIcon } from './ui'

type Props = {
  data: Uint8Array // PDF の中身
  title: string
}

// 読書画面の拡大率（＋／− で切り替える）
const ZOOMS = [1, 1.5, 2, 3]

/* ---------- PDF を読み込む（pdf.js はこのときだけ読み込む） ---------- */

function usePdf(data: Uint8Array) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    let doc: PDFDocumentProxy | null = null
    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const worker = await import('pdfjs-dist/build/pdf.worker.min.js?url')
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default
        // isEvalSupported: false … PDF の中のスクリプトを実行させない（CVE-2024-4367 対策）
        // data はコピーを渡す（pdf.js は渡したデータを使い切ってしまうため）
        // cMapUrl / standardFontDataUrl … 日本語の文字や、PDF に入っていないフォントを描くためのデータ
        //   （scripts/copy-pdfjs-assets.mjs が public/pdfjs/ に用意する）
        const assets = `${import.meta.env.BASE_URL}pdfjs/`
        doc = await pdfjs.getDocument({
          data: data.slice(),
          isEvalSupported: false,
          cMapUrl: `${assets}cmaps/`,
          cMapPacked: true,
          standardFontDataUrl: `${assets}standard_fonts/`,
        }).promise
        if (cancelled) doc.destroy()
        else setPdf(doc)
      } catch (e) {
        console.error(e)
        if (!cancelled) setError(true)
      }
    })()
    return () => {
      cancelled = true
      doc?.destroy()
    }
  }, [data])

  return { pdf, error }
}

/* ---------- 1ページ分：指定の幅で、くっきり描く ---------- */

function PageCanvas({ pdf, pageNo, width, label }: { pdf: PDFDocumentProxy; pageNo: number; width: number; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!width) return
    let task: RenderTask | null = null
    let cancelled = false
    ;(async () => {
      const page = await pdf.getPage(pageNo)
      if (cancelled || !canvasRef.current) return
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const base = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: (width / base.width) * ratio })
      const canvas = canvasRef.current
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      canvas.style.width = `${width}px`
      canvas.style.height = `${(viewport.height / viewport.width) * width}px`
      task = page.render({ canvasContext: canvas.getContext('2d')!, viewport })
      try {
        await task.promise
      } catch {
        // 拡大率を変えて描き直すときに、前の描画が中断されるのは正常
      }
    })()
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [pdf, pageNo, width])

  return (
    <canvas
      ref={canvasRef}
      aria-label={`${label} ${pageNo}ページ目`}
      onContextMenu={(e) => e.preventDefault()} // 右クリック・長押しで保存しにくくする
      className="block max-w-none border border-ink/30 bg-white shadow-sm"
    />
  )
}

// 全ページを縦につなげて描く
function Pages({ pdf, width, label, onPageClick }: { pdf: PDFDocumentProxy; width: number; label: string; onPageClick?: () => void }) {
  return (
    <>
      {Array.from({ length: pdf.numPages }, (_, i) => (
        <div key={i} onClick={onPageClick} className={onPageClick ? 'cursor-zoom-in' : undefined}>
          <PageCanvas pdf={pdf} pageNo={i + 1} width={width} label={label} />
        </div>
      ))}
    </>
  )
}

// 要素の幅を測る（画面の向きや大きさが変わったら測り直す）
function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(() => setWidth(Math.floor(el.clientWidth)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, width }
}

/* ---------- 読書画面：画面いっぱい・拡大したまま続けて読める ---------- */

function Reader({ pdf, title, onClose }: { pdf: PDFDocumentProxy; title: string; onClose: () => void }) {
  const [zoomIndex, setZoomIndex] = useState(0)
  const { ref, width: frameWidth } = useWidth<HTMLDivElement>()
  const zoom = ZOOMS[zoomIndex]

  // 等倍のときのページ幅（読みやすいよう最大 900px）。拡大するとこの何倍かになる
  const baseWidth = Math.min(frameWidth - 32, 900)
  const width = Math.max(0, Math.floor(baseWidth * zoom))

  // Esc で閉じる・後ろのページをスクロールさせない
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setZoomIndex((z) => Math.min(z + 1, ZOOMS.length - 1))
      if (e.key === '-') setZoomIndex((z) => Math.max(z - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const btn = 'h-10 w-10 rounded-full border border-paper/60 text-paper text-lg flex items-center justify-center hover:bg-paper/15 disabled:opacity-30 transition-colors'

  return (
    <div className="fixed inset-0 z-[120] flex flex-col bg-ink" role="dialog" aria-modal="true" aria-label={title}>
      {/* 上の操作バー */}
      <div className="flex items-center gap-2 border-b border-paper/15 px-3 py-2 text-paper">
        <p className="flex-1 truncate text-[13px] font-bold">{title}</p>
        <button className={btn} onClick={() => setZoomIndex((z) => Math.max(z - 1, 0))} disabled={zoomIndex === 0} aria-label="縮小">
          −
        </button>
        <span className="w-12 text-center font-mono text-[12px]">{Math.round(zoom * 100)}%</span>
        <button
          className={btn}
          onClick={() => setZoomIndex((z) => Math.min(z + 1, ZOOMS.length - 1))}
          disabled={zoomIndex === ZOOMS.length - 1}
          aria-label="拡大"
        >
          ＋
        </button>
        <button className={`${btn} ml-2`} onClick={onClose} aria-label="閉じる">
          <XIcon />
        </button>
      </div>

      {/* 全ページを縦につなげて表示。拡大したら上下左右にスクロールして読む */}
      <div ref={ref} className="flex-1 overflow-auto overscroll-contain">
        <div className="mx-auto flex w-max min-w-full flex-col items-center gap-4 px-4 py-6">
          {width > 0 && <Pages pdf={pdf} width={width} label={title} />}
        </div>
      </div>
    </div>
  )
}

/* ---------- ページ内の表示 ---------- */

// PDF の各ページを画像（canvas）としてページ内に描く。
// ブラウザ標準の PDF 表示と違ってスマホでも表示でき、ダウンロードボタンも出ない。
// ページを押す（または「拡大して読む」）と、画面いっぱいの読書画面が開く。
export function PdfViewer({ data, title }: Props) {
  const { pdf, error } = usePdf(data)
  const { ref, width } = useWidth<HTMLDivElement>()
  const [reading, setReading] = useState(false)
  const openReader = useCallback(() => setReading(true), [])
  const closeReader = useCallback(() => setReading(false), [])

  return (
    <div>
      {pdf && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-ink/50">全 {pdf.numPages} ページ</span>
          <button
            onClick={openReader}
            className="rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-paper hover:bg-curtain transition-colors"
          >
            拡大して読む ⤢
          </button>
        </div>
      )}

      <div ref={ref} className="flex flex-col gap-3 select-none">
        {pdf && width > 0 && <Pages pdf={pdf} width={width} label={title} onPageClick={openReader} />}
      </div>

      {!pdf && !error && <p className="py-6 text-center text-[13px] text-ink/60">PDFを読み込み中…</p>}
      {error && <p className="py-6 text-center text-[13px] text-curtain">PDFを表示できませんでした。</p>}

      {reading && pdf && <Reader pdf={pdf} title={title} onClose={closeReader} />}
    </div>
  )
}
