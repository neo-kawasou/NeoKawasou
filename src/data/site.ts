// サイト全体で使う設定。ここを書き換えれば全ページに反映される

const img = (name: string) => `${import.meta.env.BASE_URL}images/${name}`

export const LOGO = img('ロゴ.jpg')

export const SNS = {
  instagram: { label: 'Instagram', handle: '@neo_kawasou', href: 'https://www.instagram.com/neo_kawasou' },
  x: { label: 'X', handle: '@kawaso_geki', href: 'https://x.com/kawaso_geki' },
}

// お問い合わせフォームのURL（決まったらここに入れる。空の間はお問い合わせページへ移動）
export const CONTACT_FORM_URL = ''

// お問い合わせ先のメールアドレス（お問い合わせページのフォームもここ宛てにメールを作る）
export const CONTACT_EMAIL = 'neokawasou@gmail.com'

// お問い合わせの種類（フォームで選ぶもの）
export const CONTACT_TYPES = ['公演・チケットについて', '劇団について', 'その他']

// スマホメニューの下に出す、今の公演へのボタン
export const CURRENT_STAGE_LABEL = '第二回公演『放課後クリエイタァズ』'

// ネオ・カワソウについて（トップページと紹介ページで使う）
export const ABOUT_TEXT = '2025年9月に結成された、とある高校演劇部のOG・OBを主軸に構成された演劇集団'

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

// 演目1つ分（credit：作・演出など／text：紹介文。どちらも省略できる）
export type Program = {
  title: string
  credit?: string
  text?: string
}

// 第一回公演の演目（これまでの公演の詳細に出る。作品が複数あれば { } を足す）
export const FIRST_STAGE_PROGRAMS: Program[] = [
  {
    title: '吾妻照美のタイムマシン',
    text: [
      '十歳だった友人が、今、高校生になって目の前にいる。',
      '「未来から来たの。貴方に会うために」',
      'そう言って笑う彼女は、自分が手に入れたタイムマシンについて語り始める。',
    ].join('\n'),
  },
    {
    title: '貯水槽のマーメイド',
    text: [
      '山奥にある薄汚れた貯水槽。',
      '暗い水の中から、幼い女の子が現れる。',
      '「ねぇ、キスってしたことある？」',
      '意味不明の質問を投げ掛けてきた彼女は、自分は人魚なのだという。',
    ].join('\n'),
  },
    {
    title: '七日間の勉強合宿～オビカの場合～',
    text: [
      'お姫様が眠りから目を覚ますと、そこは見知らぬ部屋。',
      '召使兼家庭教師の青年曰く国王に口答えした罰として補習授業が始まるのだという。',
      'でも、この勉強合宿……何か変！？',
    ].join('\n'),
  },
]

// 第二回公演の演目（次回公演ページと、これまでの公演の詳細の両方に出る）
// 改行したいところで区切って、1行ずつ書く
export const SECOND_STAGE_PROGRAMS: Program[] = [
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
  programs?: Program[] // 演目（あらすじの代わりに、作品ごとに並べる）
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
    date: '2026年3月8日（日）',
    venue: 'あなたの店グループ 最上階イベントホール',
    programs: FIRST_STAGE_PROGRAMS,
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
    programs: SECOND_STAGE_PROGRAMS,
    gallery: [],
  },
  { no: 3, title: '第三回公演', status: '準備中', info: '詳細は近日公開' },
]

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

  // 演目（下の SECOND_STAGE_PROGRAMS に書く。これまでの公演の詳細にも同じものが出る）
  programs: SECOND_STAGE_PROGRAMS,

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

// よくあるご質問（お問い合わせページ。[ ] の部分は決まったら書き換える）
// a の中で改行したいときは、演目と同じく [ ].join('\n') の形で書く
export const FAQ: { q: string; a: string }[] = [
  {
    q: 'チケットはどうやって予約できますか？',
    // [こちら](URL) の「こちら」がリンクになる。URL は次回公演の予約フォームを自動で使う
    a: `公演ごとのチケット注文フォームからご予約いただけます。第二回公演のフォームは[こちら](${NEXT_STAGE.ticketUrl})から。`,
  },
  {
    q: '料金はいくらですか？',
    a: '本公演はフリーカンパ制（基本無料）です。応援したいと思っていただけた方には、ささやかなお礼が付いた応援チケットもご用意しています。',
  },
  {
    q: '応援チケットの支払い方法は？',
    a: '当日、現地で現金でお支払いいただく形になります。事前の予約やオンライン決済はございません。',
  },
]
