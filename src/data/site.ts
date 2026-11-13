// サイト全体で使う設定。ここを書き換えれば全ページに反映される

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const LOGO = img('ロゴ.jpg')

export const SNS = {
  instagram: { label: 'Instagram', handle: '@neo_kawasou', href: 'https://www.instagram.com/neo_kawasou' },
  x: { label: 'X', handle: '@kawaso_geki', href: 'https://x.com/kawaso_geki' },
}

// お問い合わせフォームのURL（決まったらここに入れる。空の間はお問い合わせページへ移動）
export const CONTACT_FORM_URL = ''

// スマホメニューの下に出す、今の公演へのボタン
export const CURRENT_STAGE_LABEL = '第二回公演『放課後クリエイタァズ』'

// ネオ・カワソウについて（トップページと紹介ページで使う）
export const ABOUT_TEXT = '[劇団紹介文：結成のきっかけ、どんな作品をつくっているか などを2〜3文で]'

// スライド（上から順に表示）
export type Slide = {
  title: string
  image: string
  page?: 'next' // サイト内のページへ
  href?: string // 外部サイトへ
}

export const SLIDES: Slide[] = [
  { title: '第二回公演 放課後クリエイタァズ', image: img('第二回公演スライド.png'), page: 'next' },
  { title: 'Instagram', image: img('インスタスライド.png'), href: SNS.instagram.href },
  { title: 'X', image: img('Xスライド.png'), href: SNS.x.href },
]

// これまでの公演（新しい公演はいちばん下に足す）
export type StageStatus = '終演' | '上演予定' | '準備中'

export type Stage = {
  no: number
  title: string
  status: StageStatus
  info: string // 時期や会場など、タイトルの下に出す1行
  image?: string // 公演写真・キービジュアル（なければ仮の枠）
  page?: 'next' // 押したときに移動するページ
}

export const STAGES: Stage[] = [
  {
    no: 1,
    title: '朗読劇『三つの秘密とその真実』',
    status: '終演',
    info: '2026.03 / あなたの店グループ 最上階イベントホール',
    image: img('第一回公演.png'),
  },
  {
    no: 2,
    title: '放課後クリエイタァズ',
    status: '上演予定',
    info: '2026.11 / JOY JOY THEATER',
    image: img('第二回公演.png'),
    page: 'next',
  },
  { no: 3, title: '第三回公演', status: '準備中', info: '詳細は近日公開' },
]
