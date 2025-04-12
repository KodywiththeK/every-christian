import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

// 감사일기 생성 유효성 검사 스키마
const gratitudeSchema = z.object({
  content: z.string().min(1, '내용을 입력해주세요.'),
  isPublic: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

// 감사일기 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.from('gratitude_journals').select('*').eq('user_id', session.user.id).order('date', { ascending: false })

    if (error) {
      console.error('감사일기 조회 오류:', error)
      return NextResponse.json({ message: '감사일기 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('감사일기 조회 오류:', error)
    return NextResponse.json({ message: '감사일기 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 감사일기 생성
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })
    }

    const body = await req.json()

    // 유효성 검사
    const result = gratitudeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { content, isPublic, tags } = result.data

    // 올바른 방식으로 Supabase 클라이언트 생성
    const supabase = createRouteHandlerClient({ cookies })

    // user_id가 올바른 UUID 형식인지 확인
    if (!session.user.id || typeof session.user.id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(session.user.id)) {
      console.error('유효하지 않은 사용자 ID:', session.user.id)
      return NextResponse.json({ message: '유효하지 않은 사용자 ID입니다.' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('gratitude_journals')
      .insert({
        user_id: session.user.id,
        content,
        is_public: isPublic || false,
        tags: tags || [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('감사일기 생성 오류:', error)
      return NextResponse.json({ message: '감사일기 작성 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '감사일기가 작성되었습니다.', gratitudeJournal: data }, { status: 201 })
  } catch (error) {
    console.error('감사일기 생성 오류:', error)
    return NextResponse.json({ message: '감사일기 작성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
