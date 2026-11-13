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
  title: string // カードに出すタイトル
  status: StageStatus
  info: string // 時期や会場など、カードのタイトルの下に出す1行
  image?: string // 公演写真・キービジュアル（なければ仮の枠）
  page?: 'next' // 詳細の小窓に「公演ページへ」ボタンを出す

  // ↓ カードを押したときに開く詳細（準備中の公演は詳細なし）
  genre?: string // 「朗読劇」など、タイトルの上に小さく出す
  name?: string // 詳細でのタイトル（なければ title を使う）
  date?: string
  venue?: string
  cast?: string
  story?: string
  gallery?: string[] // 公演写真（何枚でも）
}

export const STAGES: Stage[] = [
  {
    no: 1,
    title: '朗読劇『三つの秘密とその真実』',
    status: '終演',
    info: '2026.03 / あなたの店グループ 最上階イベントホール',
    image: img('第一回公演.png'),
    genre: '朗読劇',
    name: '三つの秘密とその真実',
    date: '2026年3月[公演日]',
    venue: 'あなたの店グループ 最上階イベントホール',
    cast: '[出演者名]',
    story: '[あらすじ：2〜3文で]',
    gallery: [],
  },
  {
    no: 2,
    title: '放課後クリエイタァズ',
    status: '上演予定',
    info: '2026.11 / JOY JOY THEATER',
    image: img('第二回公演.png'),
    page: 'next',
    date: '2026年11月21日（土）〜 22日（日）',
    venue: 'JOY JOY THEATER',
    cast: '[出演者名]',
    story: '[あらすじ：2〜3文で]',
    gallery: [],
  },
  { no: 3, title: '第三回公演', status: '準備中', info: '詳細は近日公開' },
]

// 演目1つ分（credit：作・演出など／text：紹介文。どちらも省略できる）
export type Program = {
  title: string
  credit?: string
  text?: string
}

// 次回公演ページの中身（[ ] の部分は決まったら書き換える）
export const NEXT_STAGE = {
  label: 'ネオ・カワソウ 第二回公演', // タイトル上のハンコ風ラベル
  labelShort: '第二回公演', // スマホ用
  titleLines: ['放課後', 'クリエイタァズ'], // 2行目に色の帯がつく
  date: '2026年 11月21日（土）〜 22日（日）',
  dateShort: '2026.11.21（土）〜 22（日）', // スマホ用
  venue: 'JOY JOY THEATER',
  keyVisual: img('第二回公演.png'),
  ticketUrl: 'https://forms.gle/6dyEoftm4mx9zMix5', // チケット予約フォームのURL（空にするとボタンが「準備中」になる）

  // 演目（上演する作品。いくつでも足せる。credit と text は空でもよい）
  programs: [
    {
      title: '演劇部へようこそ！',
      // 改行したいところで区切って、1行ずつ書く
      text: [
        '華のある演技をする美鳥。',
        '創造的な演技をする文歌。',
        'とある演劇部で、二人の役者が主役争いをしている。',
        'そんな折、脚本家志望の斉藤が入部し、配役の決定権が彼女に委ねられる。',
        '「お芝居ゲームで決着をつけましょう。ルールは簡単！芝居で人を騙せた方が勝ち」',
        '斉藤の提案に乗る二人。今ここに、熱い演劇バトルの火蓋が切って落とされる！',
      ].join('\n'),
    },
    { title: '「『夢』三部作」文芸俱楽部活動報告五月号より', 
      text: ['これは、文芸倶楽部の活動報告記録。' ,
        '「彼女は何故、同じ本を一か月も読んでいるんだろう？」',
        '同じクラスの女子生徒が「夢」という題の本をずっと読み続けていることに、疑問を抱いていた市村。',
        '理由が思い付かず、他の部員に意見を求めるが……',
        '「じゃあ、その理由を想像して、みんなで小説を書くのはどうですか？」',
        'と、話は想定外の方向に。果たして、三人はどんな「夢」を創り出すのか______',
      ].join('\n'),
    },
  ] as Program[],

  // タイムテーブル（1日目は黒、2日目は赤）
  schedule: [
    { date: '11.21', weekday: '土曜日', short: '土', times: ['[開演 17:00]'] },
    { date: '11.22', weekday: '日曜日', short: '日', times: ['[開演 11:00]'] },
  ],
  doorsOpen: '開場は開演の30分前',
  duration: '上演時間：約90分（予定）',

  access: {
    name: 'JOY JOY THEATER',
    address: '〒176-0002 東京都練馬区桜台１丁目２−８ 地下一階',
    station: [
      '◎桜台・新桜台駅から徒歩約3分', 
      '◎練馬駅から徒歩約10分',
    ].join('\n'),
    // Googleマップで検索する言葉（住所が決まったら住所にすると正確）
    mapQuery: 'JOY JOY THEATER',
  },

  notes: [
    '本公演はフリーカンパ制（基本無料）です。',
    'ですが、見に来てくださる皆様が応援したいと思った際には、ささやかなお礼が付きます応援チケットもございますのでご検討いただければと思います。',
  ],
}
