import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// 서버 사이드에서만 사용하는 Supabase 클라이언트 (service role key 사용)
// 주의: 이 클라이언트는 서버 사이드 코드에서만 사용해야 함
export const supabaseAdmin = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// 사용자 정보 조회 함수
export async function getUserById(userId: string) {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', userId).single()

  if (error) {
    console.error('사용자 조회 오류:', error)
    return null
  }

  return data
}

// 사용자 정보 업데이트 함수
export async function updateUser(userId: string, userData: any) {
  const { data, error } = await supabaseAdmin.from('users').update(userData).eq('id', userId).select().single()

  if (error) {
    console.error('사용자 업데이트 오류:', error)
    return null
  }

  return data
}
