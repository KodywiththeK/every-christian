'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { InfoIcon, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'

export default function DeveloperPage() {
  const { data: session, status } = useSession()
  const [apiStatus, setApiStatus] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const isDeveloper = session?.user?.email === 'developer@everychristian.com'

  // API 엔드포인트 목록
  const apiEndpoints = [
    { name: '기도제목 목록', url: '/api/prayers' },
    { name: '감사일기 목록', url: '/api/gratitude' },
    { name: '챌린지 목록', url: '/api/challenges' },
    { name: '사용자 챌린지', url: '/api/challenges/user' },
    { name: '완료된 챌린지', url: '/api/challenges/completed' },
  ]

  // API 상태 테스트
  const testApiEndpoints = async () => {
    setLoading(true)
    const results: Record<string, boolean> = {}

    for (const endpoint of apiEndpoints) {
      try {
        const response = await fetch(endpoint.url)
        results[endpoint.name] = response.ok
      } catch (error) {
        console.error(`Error testing ${endpoint.name}:`, error)
        results[endpoint.name] = false
      }
    }

    setApiStatus(results)
    setLoading(false)
  }

  useEffect(() => {
    if (status === 'authenticated' && isDeveloper) {
      testApiEndpoints()
    }
  }, [status, isDeveloper])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <p>로딩 중...</p>
      </div>
    )
  }

  if (!session || !isDeveloper) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>접근 제한</CardTitle>
            <CardDescription>이 페이지는 개발자 계정만 접근할 수 있습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-amber-50 border-amber-200">
              <InfoIcon className="h-4 w-4 text-amber-500" />
              <AlertTitle className="text-amber-700">개발자 계정으로 로그인이 필요합니다</AlertTitle>
              <AlertDescription className="text-amber-700">
                개발자 계정 정보:
                <ul className="mt-2 ml-4 list-disc">
                  <li>이메일: developer@everychristian.com</li>
                  <li>비밀번호: developer123</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Link href="/auth/signin" className="w-full">
              <Button className="w-full">로그인 페이지로 이동</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg p-4">
      <div className="container max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>개발자 페이지</CardTitle>
            <CardDescription>API 테스트 및 개발자 도구</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="bg-blue-50 border-blue-200 mb-4">
              <InfoIcon className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">개발자 계정 정보</AlertTitle>
              <AlertDescription className="text-blue-700">
                <p>이메일: {session.user.email}</p>
                <p>이름: {session.user.name}</p>
                <p>ID: {session.user.id}</p>
              </AlertDescription>
            </Alert>

            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">API 상태</h3>
              <div className="space-y-2">
                {Object.entries(apiStatus).map(([name, status]) => (
                  <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span>{name}</span>
                    {status ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-1" />
                        <span>정상</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600">
                        <XCircle className="h-5 w-5 mr-1" />
                        <span>오류</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={testApiEndpoints} disabled={loading}>
                {loading ? '테스트 중...' : 'API 상태 테스트'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>데이터베이스 관리</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/admin/seed">
                  <Button variant="outline" className="w-full">
                    데이터베이스 초기화
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>앱 페이지</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link href="/home">
                  <Button variant="outline" className="w-full">
                    홈
                  </Button>
                </Link>
                <Link href="/prayers">
                  <Button variant="outline" className="w-full">
                    기도제목
                  </Button>
                </Link>
                <Link href="/gratitude">
                  <Button variant="outline" className="w-full">
                    감사일기
                  </Button>
                </Link>
                <Link href="/challenges">
                  <Button variant="outline" className="w-full">
                    챌린지
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 인증 없이 접근 가능하도록 설정
export const dynamic = 'force-dynamic'
