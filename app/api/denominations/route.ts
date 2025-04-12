import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase.from('denominations').select('*').order('name', { ascending: true })

    if (error) {
      console.error('교단 목록 조회 오류:', error)
      return NextResponse.json({ message: '교단 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('교단 목록 조회 오류:', error)
    return NextResponse.json({ message: '교단 목록을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
