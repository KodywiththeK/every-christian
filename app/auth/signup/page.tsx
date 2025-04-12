import { AuthLayout } from "@/design/templates/AuthLayout/AuthLayout"
import { AuthForm } from "@/design/organisms/AuthForm/AuthForm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  // 이미 로그인한 사용자는 홈으로 리다이렉트
  const session = await getServerSession(authOptions)
  if (session) {
    redirect("/home")
  }

  return (
    <AuthLayout subtitle="새 계정을 만들고 믿음의 여정을 시작하세요">
      <AuthForm mode="signup" />
    </AuthLayout>
  )
}

