import { supabase } from '@/lib/supabase'
import type { Prayer } from '@/features/prayer/types'

// 기도제목 목록 조회
export async function getPrayers(userId: string): Promise<Prayer[]> {
  const { data, error } = await supabase.from('prayers').select('*').eq('user_id', userId).order('created_at', { ascending: false })

  if (error) {
    console.error('기도제목 조회 오류:', error)
    throw new Error('기도제목을 불러오는 중 오류가 발생했습니다.')
  }

  // Supabase 데이터를 애플리케이션 타입으로 변환
  return data.map((prayer) => ({
    id: prayer.id,
    userId: prayer.user_id,
    title: prayer.title,
    content: prayer.content,
    isAnswered: prayer.is_answered,
    isPublic: prayer.is_public,
    startDate: prayer.start_date,
    answeredDate: prayer.answered_date || undefined,
    createdAt: prayer.created_at,
    updatedAt: prayer.updated_at || undefined,
  }))
}

// 특정 기도제목 조회
export async function getPrayer(id: string, userId: string): Promise<Prayer> {
  const { data, error } = await supabase.from('prayers').select('*').eq('id', id).eq('user_id', userId).single()

  if (error) {
    console.error('기도제목 조회 오류:', error)
    throw new Error('기도제목을 불러오는 중 오류가 발생했습니다.')
  }

  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    content: data.content,
    isAnswered: data.is_answered,
    isPublic: data.is_public,
    startDate: data.start_date,
    answeredDate: data.answered_date || undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at || undefined,
  }
}

// 기도제목 생성
export async function createPrayer(data: Omit<Prayer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Prayer> {
  const { data: prayer, error } = await supabase
    .from('prayers')
    .insert({
      user_id: data.userId,
      title: data.title,
      content: data.content,
      is_answered: data.isAnswered || false,
      is_public: data.isPublic || false,
      start_date: data.startDate || new Date().toISOString(),
      answered_date: data.answeredDate,
      // ❌ created_at 직접 넣지 말기
    })
    .select()
    .single()

  if (error) {
    console.error('기도제목 생성 오류:', error)
    throw new Error('기도제목을 작성하는 중 오류가 발생했습니다.')
  }

  return {
    id: prayer.id,
    userId: prayer.user_id,
    title: prayer.title,
    content: prayer.content,
    isAnswered: prayer.is_answered,
    isPublic: prayer.is_public,
    startDate: prayer.start_date,
    answeredDate: prayer.answered_date || undefined,
    createdAt: prayer.created_at,
    updatedAt: prayer.updated_at || undefined,
  }
}

// 기도제목 수정
export async function updatePrayer(id: string, data: Partial<Omit<Prayer, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<Prayer> {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  }

  if (data.title !== undefined) updateData.title = data.title
  if (data.content !== undefined) updateData.content = data.content
  if (data.isAnswered !== undefined) updateData.is_answered = data.isAnswered
  if (data.isPublic !== undefined) updateData.is_public = data.isPublic
  if (data.answeredDate !== undefined) updateData.answered_date = data.answeredDate

  const { data: prayer, error } = await supabase.from('prayers').update(updateData).eq('id', id).select().single()

  if (error) {
    console.error('기도제목 수정 오류:', error)
    throw new Error('기도제목을 수정하는 중 오류가 발생했습니다.')
  }

  return {
    id: prayer.id,
    userId: prayer.user_id,
    title: prayer.title,
    content: prayer.content,
    isAnswered: prayer.is_answered,
    isPublic: prayer.is_public,
    startDate: prayer.start_date,
    answeredDate: prayer.answered_date || undefined,
    createdAt: prayer.created_at,
    updatedAt: prayer.updated_at || undefined,
  }
}

// 기도제목 삭제
export async function deletePrayer(id: string): Promise<void> {
  const { error } = await supabase.from('prayers').delete().eq('id', id)

  if (error) {
    console.error('기도제목 삭제 오류:', error)
    throw new Error('기도제목을 삭제하는 중 오류가 발생했습니다.')
  }
}
