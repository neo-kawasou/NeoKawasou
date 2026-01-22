export type NewsItem = {
  id: string
  title: string
  date: string
  content: string
}

export const newsList: NewsItem[] = [
  {
    id: '2024-01',
    title: '次回公演のお知らせ',
    date: '2024-01-10',
    content: `
ネオ・カワソウ次回公演が決定しました。

日時：2024年3月
場所：○○劇場
詳細は追って公開します。
    `,
  },
  {
    id: '2023-12',
    title: '公式サイト公開',
    date: '2023-12-01',
    content: `
ネオ・カワソウ公式サイトを公開しました。
今後はこちらで情報発信を行います。
    `,
  },
]
