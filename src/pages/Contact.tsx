import { SectionTitle } from '../components/ui'
import { CONTACT_FORM_URL } from '../data/site'

// お問い合わせページ（フォームのURLが決まったらボタンが出る）
export default function Contact() {
  return (
    <section className="container-site max-w-[800px] py-12 md:py-20">
      <SectionTitle en="CONTACT" ja="お問い合わせ" />
      <p className="mt-6 text-sm leading-loose">
        ご質問・ご相談等ございましたら、お気軽にお問い合わせください。
      </p>

      {CONTACT_FORM_URL ? (
        <a
          href={CONTACT_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-6 rounded-full bg-curtain px-8 py-4 text-sm font-bold text-paper hover:brightness-110 transition"
        >
          お問い合わせフォーム <span aria-hidden>→</span>
        </a>
      ) : (
        <p className="mt-8 rounded border border-dashed border-ink/40 bg-paper p-5 text-sm text-ink/70">
          お問い合わせフォームは準備中です。
        </p>
      )}
    </section>
  )
}
