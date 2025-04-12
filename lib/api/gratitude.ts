import { supabase } from "@/lib/supabase"
import type { GratitudeJournal } from "@/features/gratitude/types"

// 감사일기 목록 조회
export async function getGratitudeJournals(userId: string): Promise<GratitudeJournal[]> {
  const { data, error } = await supabase
    .from("gratitude_journals")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })

  if (error) {
    console.error("감사일기 조회 오류:", error)
    throw new Error("감사일기를 불러오는 중 오류가 발생했습니다.")
  }

  // Supabase 데이터를 애플리케이션 타입으로 변환
  return data.map((journal) => ({
    id: journal.id,
    userId: journal.user_id,
    content: journal.content,
    date: journal.date,
    isPublic: journal.is_public,
    tags: journal.tags || [],
    createdAt: journal.created_at,
    updatedAt: journal.updated_at || undefined,
  }))
}

// 특정 감사일기 조회
export async function getGratitudeJournal(id: string, userId: string): Promise<GratitudeJournal> {
  const { data, error } = await supabase
    .from("gratitude_journals")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single()

  if (error) {
    console.error("감사일기 조회 오류:", error)
    throw new Error("감사일기를 불러오는 중 오류가 발생했습니다.")
  }

  return {
    id: data.id,
    userId: data.user_id,
    content: data.content,
    date: data.date,
    isPublic: data.is_public,
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at || undefined,
  }
}

// 감사일기 생성
export async function createGratitudeJournal(
  data: Omit<GratitudeJournal, "id" | "createdAt" | "updatedAt">,
): Promise<GratitudeJournal> {
  const { data: journal, error } = await supabase
    .from("gratitude_journals")
    .insert({
      user_id: data.userId,
      content: data.content,
      date: data.date,
      is_public: data.isPublic,
      tags: data.tags,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("감사일기 생성 오류:", error)
    throw new Error("감사일기를 작성하는 중 오류가 발생했습니다.")
  }

  return {
    id: journal.id,
    userId: journal.user_id,
    content: journal.content,
    date: journal.date,
    isPublic: journal.is_public,
    tags: journal.tags || [],
    createdAt: journal.created_at,
    updatedAt: journal.updated_at || undefined,
  }
}

// 감사일기 수정
export async function updateGratitudeJournal(
  id: string,
  data: Partial<Omit<GratitudeJournal, "id" | "userId" | "createdAt" | "updatedAt">>,
): Promise<GratitudeJournal> {
  const { data: journal, error } = await supabase
    .from("gratitude_journals")
    .update({
      content: data.content,
      is_public: data.isPublic,
      tags: data.tags,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("감사일기 수정 오류:", error)
    throw new Error("감사일기를 수정하는 중 오류가 발생했습니다.")
  }

  return {
    id: journal.id,
    userId: journal.user_id,
    content: journal.content,
    date: journal.date,
    isPublic: journal.is_public,
    tags: journal.tags || [],
    createdAt: journal.created_at,
    updatedAt: journal.updated_at || undefined,
  }
}

// 감사일기 삭제
export async function deleteGratitudeJournal(id: string): Promise<void> {
  const { error } = await supabase.from("gratitude_journals").delete().eq("id", id)

  if (error) {
    console.error("감사일기 삭제 오류:", error)
    throw new Error("감사일기를 삭제하는 중 오류가 발생했습니다.")
  }
}

