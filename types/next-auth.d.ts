import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * 기본 세션에 사용자 ID 추가
   */
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }

  /**
   * 사용자 객체에 ID 필드 추가
   */
  interface User {
    id: string
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT 토큰에 ID 필드 추가
   */
  interface JWT {
    id: string
  }
}

