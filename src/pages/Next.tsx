import { useCallback, useState } from 'react'
import { Breadcrumb } from '../components/ui'
import { ImageViewer } from '../components/ImageViewer'
import { NEXT_STAGE as S } from '../data/site'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

// [ ] で囲まれた仮の文字かどうか（地図などは決まるまで出さない）
const isPlaceholder = (text: string) => text.trim().startsWith('[')

function Eyebrow({ children }: { children: string }) {
  return <p className="eyebrow text-curtain">{children}</p>
}

function Heading({ children }: { children: string }) {
  return <h2 className="mt-2 font-display text-[24px] md:text-[28px]">{children}</h2>
}

// チケット予約ボタン（URLが空の間は「準備中」）
function TicketButton({ className = '' }: { className?: string }) {
  if (!S.ticketUrl) {
    return (
      <span className={`inline-flex items-center justify-center rounded-full bg-ink/20 px-6 py-3.5 text-[13px] font-bold text-ink/60 ${className}`}>
        チケット予約は準備中です
      </span>
    )
  }
  return (
    <a
      href={S.ticketUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-3 rounded-full bg-curtain px-6 py-3.5 text-[13px] font-bold text-paper hover:brightness-110 transition ${className}`}
    >
      チケットを予約する <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
    </a>
  )
}

export default function Next({ onNavigate }: Props) {
  const [zoomed, setZoomed] = useState<string | null>(null)
  const closeZoom = useCallback(() => setZoomed(null), [])
  const showMap = !isPlaceholder(S.access.address)
  const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(S.access.mapQuery)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(S.access.mapQuery)}`

  return (
    <>
      <Breadcrumb current="次回公演" onHome={() => onNavigate('home')} />

      {/* ---------- チケット風の大きいカード ---------- */}
      <section className="container-site pt-6 pb-12 md:pt-8 md:pb-16">
        <div className="flex flex-col-reverse overflow-hidden rounded-md border border-ink bg-paper shadow-[6px_6px_0_0_#1c1a17] md:flex-row md:shadow-[8px_8px_0_0_#1c1a17]">
          {/* 左：公演情報 */}
          <div className="flex-1 px-5 py-7 md:px-10 md:py-10">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-curtain">NEXT STAGE</span>
              <span className="-rotate-2 border border-ink bg-paper px-2.5 py-1 text-[11px] font-bold shadow-[1px_1px_0_0_#1c1a17]">
                <span className="hidden md:inline">{S.label}</span>
                <span className="md:hidden">{S.labelShort}</span>
              </span>
            </div>

            <h1 className="mt-5 font-display text-[36px] md:text-[48px] leading-[1.15]">
              {S.titleLines[0]}
              <br />
              {/* 2行目に色の帯 */}
              <span className="bg-[linear-gradient(transparent_45%,#f0c4bd_45%)] px-1 -mx-1">{S.titleLines[1]}</span>
            </h1>

            <dl className="mt-6 border-t border-dashed border-ink/60 text-[14px]">
              <div className="flex items-baseline gap-6 border-b border-dashed border-ink/60 py-3.5">
                <dt className="w-10 shrink-0 text-[12px] font-bold text-curtain">日時</dt>
                <dd className="font-bold">
                  <span className="hidden md:inline">{S.date}</span>
                  <span className="md:hidden">{S.dateShort}</span>
                </dd>
              </div>
              <div className="flex items-baseline gap-6 border-b border-dashed border-ink/60 py-3.5">
                <dt className="w-10 shrink-0 text-[12px] font-bold text-curtain">会場</dt>
                <dd className="font-bold">{S.venue}</dd>
              </div>
            </dl>

            <TicketButton className="mt-7 hidden md:inline-flex" />
          </div>

          {/* 右（スマホでは上）：ADMIT ONE とキービジュアル */}
          <div className="border-b border-dashed border-ink bg-cream px-8 py-6 md:w-[270px] md:shrink-0 md:border-b-0 md:border-l-2 md:py-8">
            <p className="text-center font-mono text-[11px] tracking-[0.35em]">ADMIT ONE</p>
            <button
              onClick={() => setZoomed(S.keyVisual)}
              className="mx-auto mt-4 block w-[60%] rotate-[1.5deg] border border-ink bg-sand cursor-zoom-in md:w-full"
              aria-label="キービジュアルを拡大"
            >
              <img src={S.keyVisual} alt={S.titleLines.join('')} className="block w-full" />
            </button>
          </div>
        </div>

        {/* スマホ：予約ボタンとページ内リンク */}
        <div className="md:hidden">
          <TicketButton className="mt-6 flex w-full py-4" />
          <div className="mt-5 flex gap-2">
            {[
              ['あらすじ', '#story'],
              ['タイムテーブル', '#schedule'],
              ['会場', '#access'],
            ].map(([label, href]) => (
              <a key={href} href={href} className="rounded-full border border-ink px-4 py-2 text-[12px] font-bold">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- あらすじ ---------- */}
      <section id="story" className="scroll-mt-20 border-t border-ink/40 bg-paper">
        <div className="container-site py-12 md:flex md:gap-12 md:py-16">
          <div className="md:w-[180px] md:shrink-0">
            <Eyebrow>STORY</Eyebrow>
            <Heading>あらすじ</Heading>
          </div>
          <div className="mt-5 md:mt-1">
            <p className="font-display text-[17px] md:text-[18px] leading-relaxed">{S.catchcopy}</p>
            <p className="mt-4 text-sm leading-loose text-ink/80 whitespace-pre-line">{S.story}</p>
          </div>
        </div>
      </section>

      {/* ---------- タイムテーブル ---------- */}
      <section id="schedule" className="scroll-mt-20 border-t border-ink/40">
        <div className="container-site py-12 md:py-16">
          <Eyebrow>SCHEDULE</Eyebrow>
          <Heading>タイムテーブル</Heading>

          <div className="mt-7 grid gap-4 md:grid-cols-2 md:gap-5">
            {S.schedule.map((day, i) => (
              <div key={day.date} className="overflow-hidden rounded-md border border-ink bg-paper">
                <div className={`flex items-baseline gap-2 px-5 py-4 text-paper ${i % 2 === 0 ? 'bg-ink' : 'bg-curtain'}`}>
                  <span className="font-display text-[24px] md:text-[26px]">{day.date}</span>
                  <span className="text-[12px] font-bold">
                    <span className="hidden md:inline">{day.weekday}</span>
                    <span className="md:hidden">{day.short}</span>
                  </span>
                </div>
                <ul className="px-5">
                  {day.times.map((t, j) => (
                    <li key={j} className="flex items-center justify-between border-b border-dashed border-ink/30 py-3.5 last:border-b-0">
                      <span className="font-mono text-[15px]">{t}</span>
                      <span className="hidden md:inline text-[11px] text-ink/60">{S.doorsOpen}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[12px] text-ink/70">
            <span className="hidden md:inline">{S.duration}</span>
            <span className="md:hidden">{S.doorsOpen}／{S.duration}</span>
          </p>
        </div>
      </section>

      {/* ---------- 会場 ---------- */}
      <section id="access" className="scroll-mt-20 border-t border-ink/40 bg-paper">
        <div className="container-site py-12 md:flex md:gap-12 md:py-16">
          <div className="md:w-[260px] md:shrink-0">
            <Eyebrow>ACCESS</Eyebrow>
            <Heading>会場</Heading>
            <p className="mt-5 text-lg font-bold">{S.access.name}</p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink/80">
              {S.access.address}
              <br />
              {S.access.station}
            </p>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-ink px-5 py-2.5 text-[12px] font-bold hover:bg-cream transition-colors"
            >
              Googleマップで開く <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="mt-8 flex-1 overflow-hidden rounded-md border border-ink bg-sand md:mt-0">
            {showMap ? (
              <iframe
                title={`${S.access.name}の地図`}
                src={mapEmbed}
                className="h-[240px] w-full md:h-full md:min-h-[260px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-[200px] items-center justify-center text-xs text-ink/50 md:h-full md:min-h-[240px]">
                地図（住所が決まったら表示されます）
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------- ご来場のみなさまへ ---------- */}
      {S.notes.length > 0 && (
        <section className="border-t border-ink/40">
          <div className="container-site py-12 md:py-14">
            <div className="md:mx-auto md:max-w-[700px]">
              <h2 className="font-display text-[18px]">ご来場のみなさまへ</h2>
              <ul className="mt-4 list-disc space-y-1.5 pl-5 text-[13px] text-ink/80">
                {S.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      <ImageViewer src={zoomed} onClose={closeZoom} />
    </>
  )
}
