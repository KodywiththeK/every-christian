'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function SeedPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSeed = async () => {
    try {
      setIsLoading(true)
      setResult(null)

      const response = await fetch('/api/seed')
      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: data.message })
      } else {
        setResult({ success: false, message: data.message || '데이터베이스 초기화 중 오류가 발생했습니다.' })
      }
    } catch (error) {
      console.error('Error seeding database:', error)
      setResult({ success: false, message: '데이터베이스 초기화 중 오류가 발생했습니다.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>데이터베이스 초기화</CardTitle>
          <CardDescription>애플리케이션에 필요한 초기 데이터를 생성합니다. 이 작업은 한 번만 수행하면 됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {result && (
            <Alert className={result.success ? 'bg-success-light border-success' : 'bg-error-light border-error'}>
              {result.success ? <CheckCircle className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-error" />}
              <AlertTitle>{result.success ? '성공!' : '오류!'}</AlertTitle>
              <AlertDescription>{result.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSeed} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                초기화 중...
              </>
            ) : (
              '데이터베이스 초기화'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// 인증 없이 접근 가능하도록 설정
export const dynamic = 'force-dynamic'
