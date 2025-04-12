import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

// 태스크 완료 유효성 검사 스키마
const completeTaskSchema = z.object({
  taskDay: z.number().min(1, "유효한 태스크 일자가 필요합니다."),
})

// 챌린지 태스크 완료
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const body = await req.json()

    // 유효성 검사
    const result = completeTaskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { taskDay } = result.data

    const supabase = createRouteHandlerClient({ cookies })

    // 태스크 정보 조회
    const { data: task, error: taskError } = await supabase
      .from("challenge_tasks")
      .select("*")
      .eq("challenge_id", params.id)
      .eq("day", taskDay)
      .single()

    if (taskError) {
      console.error("태스크 조회 오류:", taskError)
      return NextResponse.json({ message: "태스크 정보를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 이미 완료했는지 확인
    const { data: existingCompletion, error: checkError } = await supabase
      .from("user_task_completions")
      .select("*")
      .eq("task_id", task.id)
      .eq("user_id", session.user.id)
      .single()

    if (!checkError && existingCompletion) {
      return NextResponse.json({ message: "이미 완료한 태스크입니다." }, { status: 400 })
    }

    // 완료 정보 생성
    const { error: completionError } = await supabase.from("user_task_completions").insert({
      user_id: session.user.id,
      task_id: task.id,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    })

    if (completionError) {
      console.error("태스크 완료 오류:", completionError)
      return NextResponse.json({ message: "태스크를 완료하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 사용자 챌린지 진행 상황 업데이트
    const { data: userChallenge, error: userChallengeError } = await supabase
      .from("user_challenges")
      .select("*")
      .eq("challenge_id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (userChallengeError) {
      console.error("사용자 챌린지 조회 오류:", userChallengeError)
      return NextResponse.json({ message: "챌린지 정보를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 챌린지 정보 조회
    const { data: challenge, error: challengeError } = await supabase
      .from("challenges")
      .select("*")
      .eq("id", params.id)
      .single()

    if (challengeError) {
      console.error("챌린지 조회 오류:", challengeError)
      return NextResponse.json({ message: "챌린지 정보를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 완료한 태스크 수 조회
    const { count, error: countError } = await supabase
      .from("user_task_completions")
      .select("*, challenge_tasks!inner(*)")
      .eq("user_id", session.user.id)
      .eq("challenge_tasks.challenge_id", params.id)
      .count()

    if (countError) {
      console.error("완료한 태스크 수 조회 오류:", countError)
      return NextResponse.json({ message: "완료한 태스크 수를 조회하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 진행률 계산
    const progress = Math.round(((count || 0) * 100) / challenge.duration_days)
    const completed = progress >= 100

    // 사용자 챌린지 정보 업데이트
    const updateData: any = {
      progress,
      last_check_in: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (completed && !userChallenge.completed) {
      updateData.completed = true
      updateData.completed_at = new Date().toISOString()
    }

    const { error: updateError } = await supabase.from("user_challenges").update(updateData).eq("id", userChallenge.id)

    if (updateError) {
      console.error("사용자 챌린지 업데이트 오류:", updateError)
      return NextResponse.json({ message: "챌린지 진행 상황을 업데이트하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      message: "태스크를 완료했습니다.",
      progress,
      completed,
    })
  } catch (error) {
    console.error("태스크 완료 오류:", error)
    return NextResponse.json({ message: "태스크를 완료하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

