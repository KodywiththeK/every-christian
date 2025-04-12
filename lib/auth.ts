import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

// Supabase 서버 클라이언트 생성 (service role key 사용)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// 개발자 계정 정보 (실제 프로덕션에서는 환경 변수 사용 권장)
const DEVELOPER_EMAIL = 'developer@everychristian.com'
const DEVELOPER_PASSWORD = 'developer123'
const DEVELOPER_NAME = '개발자'
const DEVELOPER_ID = 'dev-00000000-0000-0000-0000-000000000000'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/auth/new-user',
  },
  providers: [
    // 개발자 자격 증명 제공자 추가
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null

        // 개발자 계정 확인
        if (credentials.email === DEVELOPER_EMAIL && credentials.password === DEVELOPER_PASSWORD) {
          // 개발자 계정 정보 반환
          return {
            id: DEVELOPER_ID,
            name: DEVELOPER_NAME,
            email: DEVELOPER_EMAIL,
            onboardingCompleted: true, // 개발자는 온보딩 완료 상태
          }
        }

        return null
      },
    }),
    // 환경 변수가 설정된 경우에만 Google 제공자 추가
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture,
                provider: 'google',
                external_id: profile.sub,
              }
            },
          }),
        ]
      : []),
    // 환경 변수가 설정된 경우에만 Kakao 제공자 추가
    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            profile(profile) {
              return {
                id: String(profile.id),
                name: profile.properties?.nickname || '카카오 사용자',
                email: profile.kakao_account?.email,
                image: profile.properties?.profile_image,
                provider: 'kakao',
                external_id: String(profile.id),
              }
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) {
        return false
      }

      // 개발자 계정은 항상 로그인 허용
      if (user.email === DEVELOPER_EMAIL) {
        return true
      }

      // OAuth 로그인 시 사용자 정보 저장/업데이트
      if (account && account.provider !== 'credentials') {
        try {
          // 사용자 정보를 Supabase에 저장하는 API 호출
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 내부 API 호출을 위한 비밀 키 (실제 구현에서는 환경 변수로 관리)
              Authorization: `Bearer ${process.env.API_SECRET_KEY || 'internal-api-secret'}`,
            },
            body: JSON.stringify({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              provider: user.provider || account.provider,
              external_id: user.external_id || account.providerAccountId,
            }),
          })

          if (!response.ok) {
            console.error('사용자 등록 API 오류:', await response.text())
            // 개발 중에는 오류가 있어도 로그인 허용
            return true
          }

          const data = await response.json()
          // 온보딩 상태 설정
          user.onboardingCompleted = data.user.onboarding_completed
        } catch (error) {
          console.error('사용자 정보 저장 오류:', error)
          // 개발 중에는 오류가 있어도 로그인 허용
          return true
        }
      }

      return true
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        // 온보딩 상태 추가
        session.user.onboardingCompleted = token.onboardingCompleted as boolean
        // 추가 사용자 정보
        if (token.provider) session.user.provider = token.provider as string
        if (token.external_id) session.user.external_id = token.external_id as string
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        // 온보딩 상태 추가
        token.onboardingCompleted = user.onboardingCompleted
        // 추가 사용자 정보
        if (user.provider) token.provider = user.provider
        if (user.external_id) token.external_id = user.external_id
      }

      // account 정보가 있으면 provider와 external_id 추가
      if (account) {
        token.provider = account.provider
        token.external_id = account.providerAccountId
      }

      return token
    },
  },
}
