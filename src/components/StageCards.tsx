import { useCallback, useEffect, useState } from 'react'
import { Page } from '../types/page'
import { STAGES, Stage } from '../data/site'
import { ImageViewer } from './ImageViewer'
import { XIcon } from './ui'

type Props = {
  onNavigate: (page: Page) => void
  showDetailLink?: boolean // カードに「詳細を見る →」を出す（紹介ページ用）
  latest?: number // 新しい方から何件だけ出すか（なければ全部）
}

const STATUS_CLASS: Record<Stage['status'], string> = {
  終演: 'bg-ink/70 text-paper',
  上演予定: 'bg-curtain text-paper',
  準備中: 'border border-paper text-paper',
}

function StatusTag({ status }: { status: Stage['status'] }) {
  return (
    <span className={`rounded-full px-2.5 py-[2px] text-[11px] font-bold ${STATUS_CLASS[status]}`}>{status}</span>
  )
}

const no = (n: number) => `No.${String(n).padStart(2, '0')}`

// 縦長のチラシなども切らずに見せる：余白には同じ画像をぼかして敷く
function FittedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <>
      <img src={src} alt="" aria-hidden className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg opacity-70" />
      <img src={src} alt={alt} className="relative h-full w-full object-contain" />
    </>
  )
}

/* ---------- カード ---------- */

function StageCard({ stage, onOpen, showDetailLink }: { stage: Stage; onOpen: () => void; showDetailLink: boolean }) {
  // 準備中：点線の枠と COMING SOON（押せない）
  if (stage.status === '準備中') {
    return (
      <div className="flex h-full flex-col rounded border border-dashed border-paper/60">
        <div className="flex aspect-[4/3] items-center px-8">
          <p className="font-display text-[34px] lg:text-[40px] leading-[1.1] text-paper/35">COMING<br />SOON</p>
        </div>
        <div className="flex-1 border-t border-dashed border-paper/60 px-4 py-4">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl text-paper">{no(stage.no)}</span>
            <StatusTag status={stage.status} />
          </div>
          <p className="mt-1.5 text-sm font-bold text-paper">{stage.title}</p>
          <p className="mt-1 text-xs text-paper/60">{stage.info}</p>
        </div>
      </div>
    )
  }

  const isCurrent = stage.status === '上演予定'

  return (
    <button
      onClick={onOpen}
      className={`group flex h-full w-full flex-col overflow-hidden rounded bg-paper text-left text-ink transition hover:-translate-y-0.5 ${
        isCurrent ? 'shadow-[4px_4px_0_0_#e8b84a]' : ''
      }`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {stage.image ? (
          <FittedImage src={stage.image} alt={stage.title} />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/50">
            {stage.status === '終演' ? '公演写真' : 'キービジュアル'}
          </div>
        )}
      </div>
      <div className="w-full flex-1 border-t-2 border-dashed border-ink px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl">{no(stage.no)}</span>
          <StatusTag status={stage.status} />
        </div>
        <p className="mt-1.5 text-sm font-bold">{stage.title}</p>
        <p className="mt-1 font-mono text-[11px] text-ink/60">{stage.info}</p>
        {showDetailLink && (
          <p className="mt-3 text-[12px] font-bold text-curtain">
            詳細を見る <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
          </p>
        )}
      </div>
    </button>
  )
}

/* ---------- 詳細の小窓 ---------- */

function StageDetail({ stage, onClose, onNavigate }: { stage: Stage; onClose: () => void; onNavigate: Props['onNavigate'] }) {
  const [zoomed, setZoomed] = useState<string | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])

  // Esc で閉じる・後ろのページをスクロールさせない
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !zoomed && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose, zoomed])

  const rows = [
    ['日時', stage.date],
    ['会場', stage.venue],
    ['出演', stage.cast],
  ].filter(([, v]) => v) as [string, string][]

  const gallery = stage.gallery ?? []

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/70 px-4 py-10 md:flex md:items-center md:justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={stage.name ?? stage.title}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto w-full max-w-[620px] rounded-md border border-ink bg-paper text-ink shadow-[8px_8px_0_0_#9e2a2b] md:flex"
      >
        {/* 左：写真（ナナメに貼った紙） */}
        <div className="border-b border-dashed border-ink bg-cream px-8 py-6 md:w-[240px] md:shrink-0 md:border-b-0 md:border-r">
          <p className="text-center font-mono text-[11px] tracking-[0.3em]">{no(stage.no)}</p>
          <div className="relative mx-auto mt-3 aspect-[3/4] w-[60%] md:w-full -rotate-2 overflow-hidden border border-ink bg-sand">
            {stage.image ? (
              <FittedImage src={stage.image} alt={stage.title} />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-ink/50">公演写真</div>
            )}
          </div>
        </div>

        {/* 右：情報 */}
        <div className="flex-1 px-6 py-6 md:px-7">
          <div className="flex items-start justify-between">
            <StatusTag status={stage.status} />
            <button
              onClick={onClose}
              aria-label="閉じる"
              className="-mt-1 h-10 w-10 rounded-full border border-ink flex items-center justify-center hover:bg-cream transition-colors"
            >
              <XIcon />
            </button>
          </div>

          {stage.genre && <p className="mt-2 text-[12px] font-bold text-curtain">{stage.genre}</p>}
          <h3 className="mt-2 font-display text-xl md:text-2xl leading-snug">{stage.name ?? stage.title}</h3>

          {rows.length > 0 && (
            <dl className="mt-5 border-t border-dashed border-ink/50 text-[13px]">
              {rows.map(([k, v]) => (
                <div key={k} className="flex gap-6 border-b border-dashed border-ink/50 py-2.5">
                  <dt className="w-8 shrink-0 font-bold text-curtain">{k}</dt>
                  <dd className="font-bold">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {stage.story && <p className="mt-5 text-[13px] leading-relaxed text-ink/80">{stage.story}</p>}

          {gallery.length > 0 && (
            <div className="mt-5">
              <p className="eyebrow text-ink/60">GALLERY</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {gallery.map((src, i) => (
                  <button key={src + i} onClick={() => setZoomed(src)} className="aspect-square overflow-hidden bg-sand">
                    <img src={src} alt={`公演写真 ${i + 1}`} className="h-full w-full object-cover cursor-zoom-in hover:opacity-90" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {stage.page && (
            <button
              onClick={() => {
                onClose()
                onNavigate(stage.page!)
              }}
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-curtain px-6 py-3 text-[13px] font-bold text-paper hover:brightness-110 transition"
            >
              公演ページを見る <span aria-hidden>→</span>
            </button>
          )}
        </div>
      </div>

      <ImageViewer src={zoomed} onClose={closeZoom} />
    </div>
  )
}

/* ---------- 一覧 ---------- */

// これまでの公演（PC は3列、スマホは横スクロール）。カードを押すと詳細が開く
export function StageCards({ onNavigate, showDetailLink = false, latest }: Props) {
  const [opened, setOpened] = useState<Stage | null>(null)
  const close = useCallback(() => setOpened(null), [])

  // STAGES は古い順に並んでいるので、最新 N 件は後ろから取る（並び順は古い順のまま）
  const stages = latest ? STAGES.slice(-latest) : STAGES

  return (
    <div className="-mx-4 md:mx-0">
      <ul className="thin-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
        {stages.map((stage) => (
          <li key={stage.no} className="w-[72%] shrink-0 snap-start md:w-auto">
            <StageCard stage={stage} onOpen={() => setOpened(stage)} showDetailLink={showDetailLink} />
          </li>
        ))}
      </ul>

      {opened && <StageDetail stage={opened} onClose={close} onNavigate={onNavigate} />}
    </div>
  )
}
