import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/types/supabase"

// 서버 컴포넌트에서 사용할 Supabase 클라이언트
export function createServerSupabaseClient() {
  return createServerComponentClient<Database>({ cookies })
}

// 서버 액션에서 사용할 Supabase 클라이언트
export async function createServerActionClient() {
  "use server"
  return createServerComponentClient<Database>({ cookies })
}

