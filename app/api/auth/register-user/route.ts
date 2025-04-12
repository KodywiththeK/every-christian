import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase 서버 클라이언트 생성 (service role key 사용)
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(req: Request) {
  try {
    // API 보안 검증 (실제 구현에서는 더 강력한 인증 방식 사용)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || authHeader !== `Bearer ${process.env.API_SECRET_KEY || 'internal-api-secret'}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const userData = await req.json()
    console.log(userData)
    const { id, email, name, image, provider, external_id } = userData

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 })
    }

    // 사용자가 이미 존재하는지 확인
    const { data: existingUser, error: queryError } = await supabaseAdmin.from('users').select('*').eq('email', email).maybeSingle()

    if (queryError) {
      console.error('사용자 조회 오류:', queryError)
      return NextResponse.json({ message: 'Error querying user' }, { status: 500 })
    }

    let user = existingUser

    if (!existingUser) {
      // 새 사용자 생성
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          id,
          email,
          name,
          image,
          provider,
          external_id,
          created_at: new Date().toISOString(),
          onboarding_completed: false, // 새 사용자는 온보딩 미완료 상태
          last_login: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('사용자 생성 오류:', insertError)
        return NextResponse.json({ message: 'Error creating user' }, { status: 500 })
      }

      user = newUser
    } else {
      // 기존 사용자 정보 업데이트 (last_login만 업데이트)
      const { data: updatedUser, error: updateError } = await supabaseAdmin
        .from('users')
        .update({
          last_login: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single()

      if (updateError) {
        console.error('사용자 업데이트 오류:', updateError)
        // 업데이트 실패해도 기존 사용자 정보 반환
      } else {
        user = updatedUser
      }
    }

    return NextResponse.json({ message: 'User registered successfully', user })
  } catch (error) {
    console.error('사용자 등록 오류:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
