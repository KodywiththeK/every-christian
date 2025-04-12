// /app/api/user/route.ts (POST 엔드포인트 예시)
import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 신규 사용자 생성 데이터 유효성 검사 스키마
const createUserSchema = z.object({
  email: z.string().email('올바른 이메일을 입력해주세요'),
  name: z.string().optional(),
  image: z.string().optional(),
  provider: z.string(),
  external_id: z.string(),
  churchName: z.string().min(1, '교회 이름을 입력해주세요'),
  denomination: z.string().min(1, '교단을 선택해주세요'),
  age: z.number().min(1, '나이를 입력해주세요').max(120, '유효한 나이를 입력해주세요'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '성별을 선택해주세요',
  }),
  region: z.string().min(1, '지역을 입력해주세요'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('Received create user data:', body)

    // 유효성 검사
    const result = createUserSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation error:', result.error.errors)
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { email, name, image, provider, external_id, churchName, denomination, age, gender, region } = result.data

    // 새 사용자 레코드를 삽입합니다.
    // users 테이블의 id 컬럼은 DEFAULT uuid_generate_v4()로 UUID가 자동 생성됩니다.
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        name,
        image,
        provider,
        external_id,
        church_name: churchName,
        denomination,
        age,
        gender,
        region,
        onboarding_completed: true,
        last_login: new Date().toISOString(),
      })
      .select()

    if (error) {
      console.error('사용자 생성 오류:', error)
      return NextResponse.json({ message: '회원가입 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '회원가입이 완료되었습니다.', user: data })
  } catch (error) {
    console.error('회원가입 중 오류:', error)
    return NextResponse.json({ message: '회원가입 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 사용자 정보 업데이트 데이터 유효성 검사 스키마 (회원가입 후 온보딩 정보 업데이트)
const updateUserSchema = z.object({
  churchName: z.string().min(1, '교회 이름을 입력해주세요'),
  denomination: z.string().min(1, '교단을 선택해주세요'),
  age: z.number().min(1, '나이를 입력해주세요').max(120, '유효한 나이를 입력해주세요'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '성별을 선택해주세요',
  }),
  region: z.string().min(1, '지역을 입력해주세요'),
})

export async function PUT(req: Request) {
  try {
    // 인증된 사용자 세션 확인
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })
    }

    const body = await req.json()
    console.log('Received update user data:', body)

    // 유효성 검사
    const result = updateUserSchema.safeParse(body)
    if (!result.success) {
      console.error('Validation error:', result.error.errors)
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { churchName, denomination, age, gender, region } = result.data

    // 세션에 저장된 사용자 ID 기준으로 사용자 정보를 업데이트합니다.
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        church_name: churchName,
        denomination,
        age,
        gender,
        region,
        last_login: new Date().toISOString(),
      })
      .eq('id', session.user.id)
      .select()

    if (error) {
      console.error('사용자 정보 업데이트 오류:', error)
      return NextResponse.json({ message: '사용자 정보 업데이트 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '회원 정보가 업데이트되었습니다.', user: data })
  } catch (error) {
    console.error('사용자 정보 업데이트 중 오류:', error)
    return NextResponse.json({ message: '사용자 정보 업데이트 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
