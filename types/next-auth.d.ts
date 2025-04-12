import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * 기본 세션에 사용자 ID와 온보딩 상태 추가
   */
  interface Session {
    user: {
      id: string
      onboardingCompleted?: boolean
      provider?: string
      external_id?: string
    } & DefaultSession['user']
  }

  /**
   * 사용자 객체에 ID와 온보딩 상태 필드 추가
   */
  interface User {
    id: string
    onboardingCompleted?: boolean
    provider?: string
    external_id?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * JWT 토큰에 ID와 온보딩 상태 필드 추가
   */
  interface JWT {
    id: string
    onboardingCompleted?: boolean
    provider?: string
    external_id?: string
  }
}
