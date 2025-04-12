'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

// 폼 유효성 검사 스키마 (온보딩 정보)
const formSchema = z.object({
  churchName: z.string().min(1, '교회 이름을 입력해주세요'),
  denomination: z.string().min(1, '교단을 선택해주세요'),
  age: z.coerce.number().min(1, '나이를 입력해주세요').max(120, '유효한 나이를 입력해주세요'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '성별을 선택해주세요',
  }),
  region: z.string().min(1, '지역을 입력해주세요'),
})

type FormValues = z.infer<typeof formSchema>

// 교단 목록 가져오기 함수 (동일)
const fetchDenominations = async () => {
  const response = await fetch('/api/denominations')
  if (!response.ok) {
    throw new Error('교단 목록을 가져오는 중 오류가 발생했습니다')
  }
  return response.json()
}

// 신규 사용자 생성 함수
// 세션에 저장된 이메일, 이름, 이미지, provider, external_id와 폼값을 합쳐 새 사용자를 생성합니다.
const createUser = async (
  data: FormValues & {
    email: string
    name?: string
    image?: string
    provider: string
    external_id: string
  }
) => {
  const response = await fetch('/api/user/onboarding', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '회원가입 중 오류가 발생했습니다')
  }

  return response.json()
}

export default function SignupPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const queryClient = useQueryClient()

  // 폼 초기화
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      churchName: '',
      denomination: '',
      age: undefined,
      gender: undefined,
      region: '',
    },
  })

  // 교단 목록 쿼리
  const {
    data: denominations = [],
    isLoading: isLoadingDenominations,
    error: denominationsError,
  } = useQuery({
    queryKey: ['denominations'],
    queryFn: fetchDenominations,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  })

  // 회원가입(사용자 생성) 뮤테이션
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      toast({
        title: '회원가입이 완료되었습니다.',
        description: 'Every Christian에 오신 것을 환영합니다!',
      })
      router.push('/home')
    },
    onError: (error: Error) => {
      console.error('회원가입 오류:', error)
      toast({
        title: '오류가 발생했습니다',
        description: error.message || '회원가입 중 오류가 발생했습니다.',
        variant: 'destructive',
      })
    },
  })

  // 인증 상태 확인: 아직 인증되지 않았다면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated' && session?.user) {
      // 이미 회원가입(온보딩)이 완료된 사용자는 홈으로
      const user = session.user as any
      if (user.onboardingCompleted) {
        router.push('/home')
      }
    }
  }, [status, session, router])

  // 폼 제출 처리: 세션 데이터를 이용하여 회원가입 요청 전송
  const onSubmit = (values: FormValues) => {
    if (!session?.user) {
      toast({
        title: '오류가 발생했습니다',
        description: '사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.',
        variant: 'destructive',
      })
      return
    }

    createUserMutation.mutate({
      email: session.user.email || '',
      name: session.user.name || '',
      image: session.user.image || '',
      // provider와 external_id는 외부 인증시 받은 정보를 전달합니다.
      provider: session.user.provider || 'unknown',
      external_id: session.user.id,
      ...values,
    })
  }

  if (status === 'loading' || isLoadingDenominations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (denominationsError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-medium text-red-600 mb-2">데이터를 불러오는 중 오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{denominationsError instanceof Error ? denominationsError.message : '알 수 없는 오류가 발생했습니다'}</p>
          <Button onClick={() => window.location.reload()}>다시 시도</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>추가 정보 입력</CardTitle>
          <CardDescription>Every Christian 서비스를 이용하기 위해 몇 가지 추가 정보가 필요합니다. 입력하신 정보는 더 나은 서비스 제공을 위해 사용됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="churchName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>교회 이름</FormLabel>
                    <FormControl>
                      <Input placeholder="출석 중인 교회 이름을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="denomination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>교단</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="교단을 선택하세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {denominations.map((denomination: { id: string; name: string }) => (
                          <SelectItem key={denomination.id} value={denomination.name}>
                            {denomination.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>나이</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="나이를 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>성별</FormLabel>
                    <FormControl>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">남성</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">여성</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">기타</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>지역</FormLabel>
                    <FormControl>
                      <Input placeholder="거주 지역을 입력하세요 (예: 서울, 경기)" {...field} />
                    </FormControl>
                    <FormDescription>거주하시는 지역을 입력해주세요.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  '저장하기'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-500">입력하신 정보는 서비스 개선을 위해 사용되며, 언제든지 프로필 설정에서 수정하실 수 있습니다.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
