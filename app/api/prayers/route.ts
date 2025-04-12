import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { z } from 'zod'

// 개발자 계정 ID
const DEVELOPER_ID = '00000000-0000-0000-0000-000000000001' // 유효한 UUID 형식으로 변경

// 기도제목 생성 유효성 검사 스키마
const prayerSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  isPublic: z.boolean().default(false),
})

// 기도제목 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 개발자 계정인 경우 모든 기도제목 조회 가능
    const query = session.user.id === DEVELOPER_ID ? supabase.from('prayers').select('*').order('created_at', { ascending: false }) : supabase.from('prayers').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      console.error('기도제목 조회 오류:', error)
      return NextResponse.json({ message: '기도제목 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('기도제목 조회 오류:', error)
    return NextResponse.json({ message: '기도제목 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

// 기도제목 생성
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 })
    }

    const body = await req.json()

    // 유효성 검사
    const result = prayerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { title, content, isPublic } = result.data

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from('prayers')
      .insert({
        user_id: session.user.id,
        title,
        content,
        is_answered: false,
        is_public: isPublic || false,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('기도제목 생성 오류:', error)
      return NextResponse.json({ message: '기도제목 작성 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ message: '기도제목이 작성되었습니다.', prayer: data }, { status: 201 })
  } catch (error) {
    console.error('기도제목 생성 오류:', error)
    return NextResponse.json({ message: '기도제목 작성 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
