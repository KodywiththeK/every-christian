import type React from "react"
import Image from "next/image"
import Link from "next/link"

// 인증 레이아웃 컴포넌트 props 타입
interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
}

// 인증 레이아웃 컴포넌트
export function AuthLayout({
  children,
  title = "Every Christian",
  subtitle = "믿음의 여정을 함께하는 앱",
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Every Christian Logo" width={32} height={32} />
            <h1 className="text-xl font-semibold text-[#1A365D]">{title}</h1>
          </Link>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-8 flex flex-col">
        {subtitle && <p className="text-center text-gray-600 mb-8">{subtitle}</p>}

        {children}
      </main>

      <footer className="py-4 bg-white border-t border-gray-200">
        <div className="container max-w-md mx-auto px-4 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Every Christian. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

// 확장 고려:
// 1. 다국어 지원
// 2. 테마 전환 (라이트/다크 모드)
// 3. 배경 이미지 또는 패턴 추가

