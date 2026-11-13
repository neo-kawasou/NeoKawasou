import { useEffect } from 'react'

type Props = {
  src: string | null
  alt?: string
  onClose: () => void
}

// 画像を画面いっぱいに拡大表示する。背景クリック・×ボタン・Escキーで閉じる
export function ImageViewer({ src, alt, onClose }: Props) {
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [src, onClose])

  if (!src) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
      role="dialog"
      aria-modal="true"
    >
      <img
        src={src}
        alt={alt ?? ''}
        className="max-w-full max-h-full object-contain shadow-2xl"
      />
      <button
        onClick={onClose}
        aria-label="閉じる"
        className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/15 text-white text-2xl leading-none hover:bg-white/30 transition-colors"
      >
        ×
      </button>
    </div>
  )
}
