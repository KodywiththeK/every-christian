'use client'

import type React from 'react'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/design/atoms/Button/Button'
import { FormField } from '@/design/molecules/FormField/FormField'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/design/molecules/Card/Card'
import { Mail } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon } from 'lucide-react'

// 인증 폼 컴포넌트 props 타입
interface AuthFormProps {
  mode: 'signin' | 'signup'
  callbackUrl?: string
}

// 인증 폼 컴포넌트
export function AuthForm({ mode, callbackUrl = '/home' }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 이메일/비밀번호 로그인 또는 회원가입
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signin') {
        // 로그인 처리
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        })

        if (result?.error) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else {
          // 로그인 성공 - 미들웨어에서 온보딩 상태에 따라 적절한 페이지로 리다이렉트
          router.push(callbackUrl)
        }
      } else {
        // 회원가입 처리 (실제 구현에서는 API 호출)
        // 예시: API 호출 후 로그인 처리
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.message || '회원가입에 실패했습니다.')
        } else {
          // 회원가입 성공 후 자동 로그인
          await signIn('credentials', {
            redirect: false,
            email,
            password,
          })
          // 새 사용자는 온보딩 페이지로 리다이렉트
          router.push('/onboarding')
        }
      }
    } catch (err) {
      setError('인증 처리 중 오류가 발생했습니다. 다시 시도해주세요.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // 소셜 로그인 처리
  const handleSocialSignIn = async (provider: string) => {
    setLoading(true)
    try {
      // 소셜 로그인 후 미들웨어에서 온보딩 상태에 따라 적절한 페이지로 리다이렉트
      await signIn(provider, { callbackUrl })
    } catch (err) {
      console.error(err)
      setError('소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  // 개발자 계정으로 로그인
  const handleDeveloperLogin = () => {
    setEmail('developer@everychristian.com')
    setPassword('developer123')
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{mode === 'signin' ? '로그인' : '회원가입'}</CardTitle>
        <CardDescription className="text-center">{mode === 'signin' ? 'Every Christian에 오신 것을 환영합니다.' : '새 계정을 만들어 Every Christian을 시작하세요.'}</CardDescription>
      </CardHeader>
      <CardContent>
        {mode === 'signin' && (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <InfoIcon className="h-4 w-4 text-blue-500" />
            <AlertDescription className="text-blue-700">
              <p>개발자 계정으로 로그인하려면:</p>
              <p className="font-medium">이메일: developer@everychristian.com</p>
              <p className="font-medium">비밀번호: developer123</p>
              <Button variant="link" className="p-0 h-auto text-blue-600 mt-1" onClick={handleDeveloperLogin}>
                자동 입력하기
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && <FormField label="이름" type="text" placeholder="이름을 입력하세요" value={name} onChange={(e) => setName(e.target.value)} required />}

          <FormField label="이메일" type="email" placeholder="이메일을 입력하세요" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <FormField label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required />

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

          <Button type="submit" fullWidth={true} loading={loading} leftIcon={<Mail className="h-4 w-4" />}>
            {mode === 'signin' ? '로그인' : '회원가입'}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button type="button" variant="outline" fullWidth={true} onClick={() => handleSocialSignIn('google')}>
            Google로 계속하기
          </Button>
          <Button type="button" variant="outline" fullWidth={true} onClick={() => handleSocialSignIn('kakao')}>
            카카오로 계속하기
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-gray-500">
          {mode === 'signin' ? (
            <>
              계정이 없으신가요?{' '}
              <Button variant="link" onClick={() => router.push('/auth/signup')} className="p-0 h-auto">
                회원가입
              </Button>
            </>
          ) : (
            <>
              이미 계정이 있으신가요?{' '}
              <Button variant="link" onClick={() => router.push('/auth/signin')} className="p-0 h-auto">
                로그인
              </Button>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  )
}
