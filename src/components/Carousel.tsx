import { useEffect, useState } from 'react'

const items = [
  { id: 1, title: 'Slide 1', description: 'スライド1の内容' },
  { id: 2, title: 'Slide 2', description: 'スライド2の内容' },
  { id: 3, title: 'Slide 3', description: 'スライド3の内容' },
]

export function Carousel() {
  const [index, setIndex] = useState(0)

  const prev = () => {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }

  const next = () => {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  // 自動スライド
  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* スライド領域 */}
      <div className="relative overflow-hidden h-64">
        <div
          className="flex h-full transition-transform duration-300"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="min-w-full h-full flex flex-col items-center justify-center bg-slate-200"
            >
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="mt-2">{item.description}</p>
            </div>
          ))}
        </div>

        {/* 矢印 */}
        <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2
                        text-3xl text-slate-600
                        hover:text-slate-900
                        transition"
        >
          ◀
        </button>

        <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2
                        text-3xl text-slate-600
                        hover:text-slate-900
                        transition"
        >
          ▶
        </button>
      </div>

      {/* インジケーター */}
      <div className="flex justify-center gap-3 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-all
              ${index === i
                ? 'bg-blue-600 scale-110'
                : 'bg-gray-300 hover:bg-gray-400'
              }`}
          />
        ))}
      </div>
    </div>
  )
}
