type Props = {
  en: string // 上の小さい英字（例: NEWS）
  ja: string // 下の日本語（例: お知らせ）
}

// スライド・バナー画像の「NEXT STAGE」に合わせた見出し
export function SectionHeading({ en, ja }: Props) {
  return (
    <div className="my-4 text-center">
      <p className="text-xs tracking-[0.4em] text-[#3d5a8a]">{en}</p>
      <h2 className="mt-1 text-xl font-bold">{ja}</h2>
      <div className="mx-auto mt-2 h-[2px] w-10 bg-[#3d5a8a]" />
    </div>
  )
}
