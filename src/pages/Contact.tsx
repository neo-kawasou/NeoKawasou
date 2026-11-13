import { FormEvent, ReactNode, useState } from 'react'
import { Breadcrumb, InstagramIcon, XIcon } from '../components/ui'
import { CONTACT_EMAIL, CONTACT_TYPES, FAQ, NEXT_STAGE, SNS } from '../data/site'
import { contentToHtml } from '../data/newsSheet'
import { Page } from '../types/page'

type Props = {
  onNavigate: (page: Page) => void
}

function MailIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6l8.5 7 8.5-7" />
    </svg>
  )
}

/* ---------- 連絡先カード（メール / Instagram / X） ---------- */

function ContactCard({
  label,
  title,
  sub,
  href,
  icon,
  primary = false,
}: {
  label: string
  title: string
  sub: string
  href: string
  icon: ReactNode
  primary?: boolean
}) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`group block rounded-md border border-ink bg-paper px-5 py-5 transition hover:-translate-y-0.5 ${
        primary ? 'shadow-[5px_5px_0_0_#1c1a17]' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] text-curtain">{label}</span>
        <span className="text-ink">{icon}</span>
      </div>
      <p className="mt-3 font-display text-[16px] md:text-[17px]">{title}</p>
      <p className="mt-2 break-all font-mono text-[12px] text-ink/80 group-hover:text-curtain transition-colors">{sub}</p>
    </a>
  )
}

/* ---------- フォーム ---------- */

const inputClass =
  'mt-2 w-full rounded border border-ink bg-paper px-3 py-2.5 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-curtain/40'

function Required() {
  return <span className="ml-1.5 text-[10px] font-bold text-curtain">必須</span>
}

function ContactForm() {
  const [type, setType] = useState(CONTACT_TYPES[0])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [opened, setOpened] = useState(false)

  // 送信：入力内容を書き込んだメールを、見ている人のメールアプリで開く
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const subject = `【お問い合わせ】${type}`
    const body = [`お名前：${name}`, `メールアドレス：${email}`, `種類：${type}`, '', message].join('\n')
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }

  return (
    <form onSubmit={onSubmit} className="rounded-md border border-ink bg-cream px-5 py-6 md:px-7 md:py-7">
      <fieldset>
        <legend className="text-[13px] font-bold">
          お問い合わせの種類<Required />
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {CONTACT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={`rounded-full border border-ink px-4 py-2 text-[12px] font-bold transition-colors ${
                type === t ? 'bg-ink text-paper' : 'bg-paper hover:bg-cream'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block text-[13px] font-bold">
          お名前<Required />
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="例：川口 太郎" className={inputClass} />
        </label>
        <label className="block text-[13px] font-bold">
          メールアドレス<Required />
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className={inputClass}
          />
        </label>
      </div>

      <label className="mt-5 block text-[13px] font-bold">
        お問い合わせ内容<Required />
        <textarea
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ご質問・ご相談の内容をご記入ください"
          className={`${inputClass} resize-y`}
        />
      </label>

      <button
        type="submit"
        className="group mt-6 inline-flex items-center gap-3 rounded-full bg-curtain px-7 py-3.5 text-[13px] font-bold text-paper hover:brightness-110 transition"
      >
        送信する <span className="transition-transform group-hover:translate-x-1" aria-hidden>→</span>
      </button>

      {opened && (
        <p className="mt-4 text-[12px] leading-relaxed text-ink/70">
          メールアプリが開きます。内容を確認して、そのまま送信してください。
          <br />
          開かない場合は、{CONTACT_EMAIL} 宛てに直接メールをお送りください。
        </p>
      )}
    </form>
  )
}

/* ---------- よくあるご質問 ---------- */

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <li className="border-b border-ink/40">
      <button onClick={() => setOpen((v) => !v)} aria-expanded={open} className="flex w-full items-center gap-4 py-5 text-left">
        <span className="font-display text-curtain">Q.</span>
        <span className="flex-1 text-[14px] font-bold">{q}</span>
        <span className="w-4 text-center text-lg leading-none" aria-hidden>{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="flex gap-4 pb-5">
          <span className="font-display text-ink/50">A.</span>
          {/* [文字](URL) と書くとリンクになる（お知らせと同じ書き方） */}
          <p
            className="flex-1 text-[13px] leading-loose text-ink/80"
            dangerouslySetInnerHTML={{ __html: contentToHtml(a, '') }}
          />
        </div>
      )}
    </li>
  )
}

/* ---------- ページ ---------- */

export default function Contact({ onNavigate }: Props) {
  return (
    <>
      {/* 赤い幕の背景 */}
      <section className="curtain-stripes text-paper">
        <div className="[&_nav]:text-paper/80 [&_button:hover]:text-mustard">
          <Breadcrumb current="お問い合わせ" onHome={() => onNavigate('home')} />
        </div>
        <div className="container-site pt-8 pb-24 md:pt-10 md:pb-28">
          <p className="eyebrow text-mustard">CONTACT</p>
          <h1 className="mt-3 font-display text-[32px] md:text-[44px]">お問い合わせ</h1>
          <p className="mt-4 text-[13px] md:text-sm">ご質問・ご相談等ございましたら、こちらからお気軽にお問い合わせください。</p>
        </div>
      </section>

      {/* 連絡先カード（赤い背景に半分かかる） */}
      <section className="container-site -mt-16 pb-14 md:pb-16">
        {/* メールは下の「メールで送る」にまとめたので、ここは SNS の DM だけ */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-4">
          <ContactCard label="INSTAGRAM" title="Instagram DM" sub={SNS.instagram.handle} href={SNS.instagram.href} icon={<InstagramIcon />} primary />
          <ContactCard label="X" title="X（旧Twitter）DM" sub={SNS.x.handle} href={SNS.x.href} icon={<XIcon />} />
        </div>
      </section>

      {/* メールで送る */}
      <section id="form" className="scroll-mt-20 border-t border-ink/40 bg-paper">
        <div className="container-site py-12 md:flex md:gap-12 md:py-16">
          <div className="md:w-[210px] md:shrink-0">
            <p className="eyebrow text-curtain">MAIL</p>
            <h2 className="mt-2 font-display text-[24px] md:text-[26px]">メールで送る</h2>
            <p className="mt-4 text-[12px] leading-loose text-ink/70">
              送信するを押すと、入力した内容でメールが作成されます。内容を確認のうえ、メールにてご返信いたします。お返事まで数日いただく場合があります。
            </p>
            {/* 直接メールを書きたい人向けにアドレスも出す */}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-2 break-all font-mono text-[12px] underline underline-offset-4 hover:text-curtain"
            >
              <MailIcon className="h-4 w-4 shrink-0" />
              {CONTACT_EMAIL}
            </a>
            {NEXT_STAGE.ticketUrl && (
              <div className="mt-6 rounded border border-dashed border-curtain px-4 py-4">
                <p className="text-[11px] font-bold text-curtain">{NEXT_STAGE.labelShort}のチケットのご予約は</p>
                <a
                  href={NEXT_STAGE.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[12px] font-bold underline underline-offset-4 hover:text-curtain"
                >
                  チケット注文フォームへ ↗
                </a>
              </div>
            )}
          </div>
          <div className="mt-8 flex-1 md:mt-0">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* よくあるご質問 */}
      {FAQ.length > 0 && (
        <section className="border-t border-ink/40">
          <div className="container-site py-12 md:py-16">
            <div className="md:mx-auto md:max-w-[700px]">
              <p className="eyebrow text-curtain">FAQ</p>
              <h2 className="mt-2 font-display text-[24px] md:text-[26px]">よくあるご質問</h2>
              <ul className="mt-6 border-t border-ink">
                {FAQ.map((f, i) => (
                  <FaqItem key={f.q} q={f.q} a={f.a} defaultOpen={i === 0} />
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
