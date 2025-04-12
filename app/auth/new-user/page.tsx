import { AuthLayout } from "@/design/templates/AuthLayout/AuthLayout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/design/molecules/Card/Card"
import { Button } from "@/design/atoms/Button/Button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function NewUserPage() {
  // 세션 확인
  const session = await getServerSession(authOptions)

  // 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
  if (!session) {
    redirect("/auth/signin")
  }

  const userName = session.user.name || "사용자"

  return (
    <AuthLayout subtitle="Every Christian에 오신 것을 환영합니다">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2 flex flex-col items-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-2" />
          <CardTitle className="text-center">가입을 축하합니다!</CardTitle>
          <CardDescription className="text-center">
            {userName}님, Every Christian에 오신 것을 환영합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            이제 Every Christian과 함께 믿음의 여정을 시작해보세요. 매일의 감사와 기도, 성경 읽기를 통해 영적 성장을
            경험하세요.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/home">
              <Button variant="default" fullWidth={true}>
                시작하기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

