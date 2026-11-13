import { SectionTitle } from '../components/ui'

// 次回公演ページ（中身はこれから）
export default function Next() {
  return (
    <section className="container-site max-w-[800px] py-12 md:py-20">
      <SectionTitle en="NEXT STAGE" ja="次回公演" />
      <p className="mt-6 rounded border border-dashed border-ink/40 bg-paper p-5 text-sm text-ink/70">
        公演情報は準備中です。
      </p>
    </section>
  )
}
