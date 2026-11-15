import { useEffect, useRef, useState } from 'react'

type Props = {
  data: Uint8Array // PDF の中身
  title: string
}

// PDF の各ページを画像（canvas）としてページ内に描く。
// ブラウザ標準の PDF 表示と違ってスマホでも表示でき、ダウンロードボタンも出ない。
// pdf.js は大きいので、このページを開いたときだけ読み込む。
export function PdfViewer({ data, title }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'loading' | 'done' | 'error'>('loading')
  const [pages, setPages] = useState(0)

  useEffect(() => {
    let cancelled = false
    const container = containerRef.current
    if (!container) return

    ;(async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        const worker = await import('pdfjs-dist/build/pdf.worker.min.js?url')
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default

        // isEvalSupported: false … PDF の中のスクリプトを実行させない（CVE-2024-4367 対策）
        // data はコピーを渡す（pdf.js は渡したデータを使い切ってしまうため）
        const pdf = await pdfjs.getDocument({ data: data.slice(), isEvalSupported: false }).promise
        if (cancelled) return
        setPages(pdf.numPages)
        container.innerHTML = ''

        // 画面の幅に合わせて、くっきり見える解像度で描く
        const width = container.clientWidth
        const ratio = Math.min(window.devicePixelRatio || 1, 2)

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          if (cancelled) return
          const base = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: (width / base.width) * ratio })

          const canvas = document.createElement('canvas')
          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = '100%'
          canvas.className = 'block border border-ink/30 bg-white shadow-sm'
          canvas.setAttribute('aria-label', `${title} ${i}ページ目`)
          // 右クリック・長押しで保存しにくくする
          canvas.addEventListener('contextmenu', (e) => e.preventDefault())
          container.appendChild(canvas)

          await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise
        }
        if (!cancelled) setState('done')
      } catch (e) {
        console.error(e)
        if (!cancelled) setState('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [data, title])

  return (
    <div>
      <div ref={containerRef} className="flex flex-col gap-3 select-none" />
      {state === 'loading' && <p className="py-6 text-center text-[13px] text-ink/60">PDFを読み込み中…</p>}
      {state === 'error' && <p className="py-6 text-center text-[13px] text-curtain">PDFを表示できませんでした。</p>}
      {state === 'done' && pages > 1 && <p className="mt-2 text-right font-mono text-[11px] text-ink/50">全 {pages} ページ</p>}
    </div>
  )
}
