"use client"

import { useEffect } from "react"
import { signOut } from "next-auth/react"
import { AuthLayout } from "@/design/templates/AuthLayout/AuthLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/design/molecules/Card/Card"
import { Button } from "@/design/atoms/Button/Button"
import { LogOut } from "lucide-react"
import Link from "next/link"

export default function SignOutPage() {
  useEffect(() => {
    // 자동으로 로그아웃 처리
    signOut({ redirect: false })
  }, [])

  return (
    <AuthLayout subtitle="로그아웃 되었습니다">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-2 flex flex-col items-center">
          <LogOut className="h-12 w-12 text-blue-500 mb-2" />
          <CardTitle className="text-center">로그아웃 완료</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-gray-600">
            성공적으로 로그아웃되었습니다. 다시 로그인하시거나 홈으로 돌아가실 수 있습니다.
          </p>
          <div className="flex flex-col gap-2">
            <Link href="/auth/signin">
              <Button variant="default" fullWidth={true}>
                다시 로그인하기
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

