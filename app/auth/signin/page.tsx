import { AuthLayout } from '@/design/templates/AuthLayout/AuthLayout'
import { AuthForm } from '@/design/organisms/AuthForm/AuthForm'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function SignInPage() {
  try {
    // 이미 로그인한 사용자는 홈으로 리다이렉트
    const session = await getServerSession(authOptions)
    if (session) {
      redirect('/home')
    }

    return (
      <AuthLayout subtitle="믿음의 여정을 함께하는 앱에 로그인하세요">
        <AuthForm mode="signin" />
      </AuthLayout>
    )
  } catch (error) {
    console.error('인증 세션 확인 중 오류 발생:', error)

    // 오류가 발생해도 로그인 페이지는 표시
    return (
      <AuthLayout subtitle="믿음의 여정을 함께하는 앱에 로그인하세요">
        <AuthForm mode="signin" />
      </AuthLayout>
    )
  }
}
