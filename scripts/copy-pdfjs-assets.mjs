// pdf.js が日本語などを描くのに使うデータ（文字の対応表 CMap・標準フォント）を
// node_modules から public/pdfjs/ にコピーする。npm run dev / build の前に自動で動く。
import { cpSync, existsSync } from 'node:fs'

const SRC = 'node_modules/pdfjs-dist'
const OUT = 'public/pdfjs'

for (const dir of ['cmaps', 'standard_fonts']) {
  if (!existsSync(`${SRC}/${dir}`)) {
    console.error(`${SRC}/${dir} がありません。npm install を実行してください。`)
    process.exit(1)
  }
  cpSync(`${SRC}/${dir}`, `${OUT}/${dir}`, { recursive: true })
}
console.log('pdf.js のデータをコピーしました → public/pdfjs/')
