import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// 온보딩이 필요한 경로 목록
const PROTECTED_ROUTES = ['/home', '/prayers', '/gratitude', '/challenges', '/profile', '/community', '/bible']

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // 세션 새로고침
  await supabase.auth.getSession()

  // NextAuth 세션 확인
  const token = await getToken({ req })

  // 경로 확인
  const path = req.nextUrl.pathname

  // 인증된 사용자이고 보호된 경로에 접근하려는 경우
  if (token && PROTECTED_ROUTES.some((route) => path.startsWith(route))) {
    // 온보딩이 완료되지 않은 경우 온보딩 페이지로 리다이렉트
    if (token.onboardingCompleted !== true && path !== '/onboarding') {
      const url = new URL('/onboarding', req.url)
      return NextResponse.redirect(url)
    }
  }

  return res
}

// 미들웨어가 실행될 경로 지정
export const config = {
  matcher: [
    /*
     * 다음 경로에서 미들웨어 실행:
     * - 모든 인증 관련 경로 (/auth/*)
     * - 홈 페이지
     * - 앱의 주요 기능 페이지
     */
    '/auth/:path*',
    '/home',
    '/prayers/:path*',
    '/gratitude/:path*',
    '/challenges/:path*',
    '/profile/:path*',
    '/community/:path*',
    '/bible/:path*',
    '/onboarding',
  ],
}
