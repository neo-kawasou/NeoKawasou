export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // サイト全体の色（デザイン案より）
      colors: {
        cream: '#f4ede2', // 背景
        paper: '#fdfaf3', // 紙・カード
        ink: '#1c1a17', // 黒
        curtain: '#9e2a2b', // えんじ（赤）
        mustard: '#e8b84a', // からし色
        sand: '#e4d9c6', // 画像の仮置き
      },
      fontFamily: {
        // 見出し用の極太フォント
        display: ['"Dela Gothic One"', 'sans-serif'],
        // 日付・ラベル用の等幅フォント
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
        // 本文
        sans: ['"Zen Kaku Gothic New"', '"Hiragino Sans"', '"Noto Sans JP"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
