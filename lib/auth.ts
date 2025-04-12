import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import CredentialsProvider from 'next-auth/providers/credentials'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트 생성
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
const DEVELOPER_ID = '00000000-0000-0000-0000-000000000001' // 유효한 UUID 형식으로 변경

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
          }
        }

        // Supabase에서 사용자 확인 (실제 구현 시 추가)
        // const { data, error } = await supabaseAdmin
        //   .from("users")
        //   .select("*")
        //   .eq("email", credentials.email)
        //   .single()

        // if (data && validatePassword(credentials.password, data.password)) {
        //   return {
        //     id: data.id,
        //     name: data.name,
        //     email: data.email,
        //   }
        // }

        return null
      },
    }),
    // 환경 변수가 설정된 경우에만 Google 제공자 추가
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // 환경 변수가 설정된 경우에만 Kakao 제공자 추가
    ...(process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET
      ? [
          KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
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
          // 사용자가 이미 존재하는지 확인
          const { data: existingUser, error: queryError } = await supabaseAdmin.from('users').select('*').eq('email', user.email).maybeSingle()

          if (queryError) throw queryError

          if (!existingUser) {
            // 새 사용자 생성
            const { error: insertError } = await supabaseAdmin.from('users').insert({
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
              created_at: new Date().toISOString(),
            })

            if (insertError) throw insertError
          } else {
            // 기존 사용자 정보 업데이트
            const { error: updateError } = await supabaseAdmin
              .from('users')
              .update({
                name: user.name,
                image: user.image,
              })
              .eq('id', existingUser.id)

            if (updateError) throw updateError
          }
        } catch (error) {
          console.error('사용자 정보 저장 오류:', error)
          // 개발 중에는 항상 성공으로 처리
          return true
        }
      }

      return true
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}
