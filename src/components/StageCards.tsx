import { Page } from '../types/page'
import { STAGES, Stage } from '../data/site'

type Props = {
  onNavigate: (page: Page) => void
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

function StageCard({ stage, onNavigate }: { stage: Stage; onNavigate: Props['onNavigate'] }) {
  const clickable = !!stage.page
  const onClick = () => stage.page && onNavigate(stage.page)

  // 準備中：点線の枠と COMING SOON
  if (stage.status === '準備中') {
    return (
      <div className="flex h-full flex-col rounded border border-dashed border-paper/60">
        <div className="flex aspect-[4/3] items-center px-8">
          <p className="font-display text-[34px] lg:text-[40px] leading-[1.1] text-paper/35">COMING<br />SOON</p>
        </div>
        <div className="border-t border-dashed border-paper/60 px-4 py-4">
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
      onClick={onClick}
      disabled={!clickable}
      className={`flex h-full w-full flex-col overflow-hidden rounded bg-paper text-left text-ink transition ${
        isCurrent ? 'shadow-[4px_4px_0_0_#e8b84a]' : ''
      } ${clickable ? 'hover:-translate-y-0.5' : 'cursor-default'}`}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand">
        {stage.image ? (
          <>
            {/* 縦長のチラシなども切らずに見せる：余白には同じ画像をぼかして敷く */}
            <img
              src={stage.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-lg opacity-70"
            />
            <img src={stage.image} alt={stage.title} className="relative h-full w-full object-contain" />
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-ink/50">
            {stage.status === '終演' ? '公演写真' : 'キービジュアル'}
          </div>
        )}
      </div>
      <div className="w-full border-t-2 border-dashed border-ink px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-xl">{no(stage.no)}</span>
          <StatusTag status={stage.status} />
        </div>
        <p className="mt-1.5 text-sm font-bold">{stage.title}</p>
        <p className="mt-1 font-mono text-[11px] text-ink/60">{stage.info}</p>
      </div>
    </button>
  )
}

// これまでの公演（PC は3列、スマホは横スクロール）
export function StageCards({ onNavigate }: Props) {
  return (
    <div className="-mx-4 md:mx-0">
      <ul className="thin-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0">
        {STAGES.map((stage) => (
          <li key={stage.no} className="w-[72%] shrink-0 snap-start md:w-auto">
            <StageCard stage={stage} onNavigate={onNavigate} />
          </li>
        ))}
      </ul>
    </div>
  )
}
