import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'

export default async function HomeLayout({ children }: { children: ReactNode }) {
  try {
    const session = await getServerSession(authOptions)

    // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
    if (!session) {
      redirect('/auth/signin')
    }

    return <>{children}</>
  } catch (error) {
    console.error('인증 세션 확인 중 오류 발생:', error)
    // 오류 발생 시 로그인 페이지로 리다이렉트
    redirect('/auth/signin')
  }
}
