import { AuthLayout } from "@/design/templates/AuthLayout/AuthLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/design/molecules/Card/Card"
import { Button } from "@/design/atoms/Button/Button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function AuthErrorPage() {
  // 에러 메시지 매핑
  const errorMessages: Record<string, string> = {
    Configuration: "인증 서비스 구성에 문제가 있습니다.",
    AccessDenied: "접근이 거부되었습니다.",
    Verification: "이메일 확인 링크가 만료되었거나 이미 사용되었습니다.",
    OAuthSignin: "소셜 로그인 과정에서 오류가 발생했습니다.",
    OAuthCallback: "소셜 로그인 콜백 과정에서 오류가 발생했습니다.",
    OAuthCreateAccount: "소셜 계정으로 사용자를 생성하는 과정에서 오류가 발생했습니다.",
    EmailCreateAccount: "이메일로 사용자를 생성하는 과정에서 오류가 발생했습니다.",
    Callback: "인증 콜백 과정에서 오류가 발생했습니다.",
    OAuthAccountNotLinked: "이미 다른 방식으로 로그인한 이메일입니다. 기존 로그인 방식을 사용해주세요.",
    EmailSignin: "이메일 로그인 과정에서 오류가 발생했습니다.",
    CredentialsSignin: "로그인 정보가 올바르지 않습니다.",
    SessionRequired: "이 페이지에 접근하려면 로그인이 필요합니다.",
    Default: "인증 과정에서 오류가 발생했습니다.",
  }

  return (
    <AuthLayout subtitle="인증 과정에서 문제가 발생했습니다">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2 flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
          <CardTitle className="text-center">인증 오류</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            인증 과정에서 문제가 발생했습니다. 다시 시도하거나 다른 로그인 방법을 사용해보세요.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/auth/signin">
              <Button variant="default" fullWidth={true}>
                로그인 페이지로 돌아가기
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" fullWidth={true}>
                홈으로 돌아가기
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}

