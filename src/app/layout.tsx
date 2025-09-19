import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopMind - AI 기반 스마트 쇼핑 도우미',
  description: '제품 사진만 찍으면 똑똑한 비교가 시작돼요. 당신만의 알레르기 정보와 선호도를 고려해서 최적의 제품을 추천해드려요.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
