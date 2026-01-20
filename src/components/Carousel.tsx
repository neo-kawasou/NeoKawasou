import { useEffect, useState } from 'react'

const items = [
  {
    id: 1,
    title: 'Slide 1',
    description: 'スライド1の内容',
    image: `${import.meta.env.BASE_URL}images/next.png`,
  },
  {
    id: 2,
    title: 'Slide 2',
    description: 'スライド2の内容',
    image: `${import.meta.env.BASE_URL}images/next.png`,
  },
  {
    id: 3,
    title: 'Slide 3',
    description: 'スライド3の内容',
    image: `${import.meta.env.BASE_URL}images/next.png`,
  },
]

export function Carousel() {
  const [index, setIndex] = useState(0)

  const prev = () => {
    setIndex((i) => (i === 0 ? items.length - 1 : i - 1))
  }

  const next = () => {
    setIndex((i) => (i === items.length - 1 ? 0 : i + 1))
  }

  useEffect(() => {
    const timer = setInterval(next, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full">

      {/* スライド領域：画面いっぱい */}
      <div
        className="
          relative
          w-full
          overflow-hidden
          aspect-video
          max-h-[400px]
        "
      >
        <div
          className="flex h-full transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="
                min-w-full
                h-full
                relative
                overflow-hidden
                flex
                items-center
                justify-center
                bg-black
              "
            >
              <img
                src={item.image}
                alt=""
                aria-hidden
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  scale-110
                  blur-xl
                  opacity-80
                "
              />
              <img
                src={item.image}
                alt={item.title}
                className="
                  relative
                  z-10
                  w-full
                  h-full
                  object-contain
                "
              />
            </div>
          ))}
        </div>

        {/* 矢印 */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl"
        >
          ◀
        </button>

        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-3xl"
        >
          ▶
        </button>
      </div>

      {/* インジケーター：中央 */}
      <div className="flex justify-center gap-3 mt-4">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition-all
              ${
                index === i
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-300'
              }
            `}
          />
        ))}
      </div>

    </div>
  )
}
