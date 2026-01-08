import React from 'react'
import { Carousel } from '../components/Carousel'

export default function Home() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Carousel />
      <div className="font-bold text-xl justify-items-center align-items-center">ネオ・カワソウのホームページ</div>
      <div>aaaaaaaa</div>
    </div>
  )
}
