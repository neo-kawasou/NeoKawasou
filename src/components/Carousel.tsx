import { useEffect, useState } from 'react'
import { Page } from '../types/page'

type Item = {
  id: number
  title: string
  image: string
  page?: Page
  href?: string
}

const items: Item[] = [
  {
    id: 1,
    title: '次回公演',
    image: `${import.meta.env.BASE_URL}images/next.png`,
    page: 'next',
  },
  {
    id: 2,
    title: 'Instagram',
    image: `${import.meta.env.BASE_URL}images/インスタ.png`,
    href: 'https://www.instagram.com/neo_kawasou',
  },
  {
    id: 3,
    title: 'Twitter',
    image: `${import.meta.env.BASE_URL}images/Twitter.png`,
    href: 'https://twitter.com/kawaso_geki',
  },
]

type Props = {
  onNavigate: (page: Page) => void
}

export function Carousel({ onNavigate }: Props) {
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
      <div
        className="
          relative
          w-full
          overflow-hidden
          aspect-[3/1]
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
              onClick={() => {
                if (item.page) {
                  onNavigate(item.page)
                } else if (item.href) {
                  window.open(item.href, '_blank', 'noopener,noreferrer')
                }
              }}
              className="
                min-w-full
                h-full
                relative
                overflow-hidden
                flex
                items-center
                justify-center
                bg-black
                cursor-pointer
                hover:brightness-110
                transition
              "
            >
              {/* ぼかし背景 */}
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

              {/* メイン画像 */}
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

        {/* 左矢印 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            prev()
          }}
          className="
            absolute left-4 top-1/2 -translate-y-1/2
            text-xl text-gray-400 hover:text-gray-100
            transition-colors select-none
          "
        >
          ◀
        </button>

        {/* 右矢印 */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            next()
          }}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-xl text-gray-400 hover:text-gray-100
            transition-colors select-none
          "
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
            className={`
              h-3 w-3 rounded-full transition-all
              ${index === i ? 'bg-blue-600 scale-110' : 'bg-gray-300'}
            `}
          />
        ))}
      </div>
    </div>
  )
}
