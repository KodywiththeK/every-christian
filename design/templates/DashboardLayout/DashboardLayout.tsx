"use client"

import React from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import MainNavigation from "@/shared/components/MainNavigation"

// 대시보드 레이아웃 컴포넌트 props 타입
interface DashboardLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  header?: React.ReactNode
}

// 대시보드 레이아웃 컴포넌트
export function DashboardLayout({ children, requireAuth = true, header }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // 인증이 필요한 페이지에서 로그인 상태 확인
  React.useEffect(() => {
    if (requireAuth && status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [requireAuth, status, router])

  // 로딩 중 표시
  if (requireAuth && status === "loading") {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
        <div className="flex-1 container max-w-md mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1A365D] mx-auto"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
      {header}

      <main className="flex-1 container max-w-md mx-auto px-4 py-6">{children}</main>

      <MainNavigation />
    </div>
  )
}

// 확장 고려:
// 1. 권한 기반 접근 제어
// 2. 사이드바 네비게이션 옵션
// 3. 페이지 전환 애니메이션

