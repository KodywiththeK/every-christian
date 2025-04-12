import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// 특정 챌린지 조회
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const supabase = createRouteHandlerClient({ cookies })

    // 챌린지 기본 정보 조회
    const { data: challenge, error } = await supabase.from("challenges").select("*").eq("id", params.id).single()

    if (error) {
      console.error("챌린지 조회 오류:", error)
      return NextResponse.json({ message: "챌린지를 찾을 수 없습니다." }, { status: 404 })
    }

    // 참여자 수 조회
    const { count: participantsCount, error: countError } = await supabase
      .from("user_challenges")
      .select("*", { count: "exact", head: true })
      .eq("challenge_id", params.id)

    if (countError) {
      console.error("참여자 수 조회 오류:", countError)
    }

    // 사용자가 참여 중인지 확인
    let userChallenge = null
    if (userId) {
      const { data: userChallengeData, error: userChallengeError } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("challenge_id", params.id)
        .eq("user_id", userId)
        .single()

      if (!userChallengeError && userChallengeData) {
        userChallenge = userChallengeData
      }
    }

    // 챌린지 태스크 조회
    const { data: tasks, error: tasksError } = await supabase
      .from("challenge_tasks")
      .select("*")
      .eq("challenge_id", params.id)
      .order("day", { ascending: true })

    if (tasksError) {
      console.error("챌린지 태스크 조회 오류:", tasksError)
    }

    // 완료한 태스크 조회
    let completedDays = []
    if (userId && userChallenge) {
      const { data: completions, error: completionsError } = await supabase
        .from("user_task_completions")
        .select("*, challenge_tasks!inner(*)")
        .eq("user_id", userId)
        .in("challenge_tasks.challenge_id", [params.id])
        .order("completed_at", { ascending: false })

      if (!completionsError && completions) {
        completedDays = completions.map((completion) => ({
          day: completion.challenge_tasks.day,
          date: completion.completed_at,
        }))
      }
    }

    // 챌린지 태스크 매핑
    const challengeTasks =
      tasks?.map((task) => {
        const isToday = new Date(task.date).toDateString() === new Date().toDateString()
        const completed = completedDays.some((day) => day.day === task.day)

        return {
          day: task.day,
          date: task.date,
          title: task.title,
          description: task.description || "",
          isToday,
          completed,
        }
      }) || []

    // 현재 진행 상황 계산
    const currentDay = userChallenge ? calculateCurrentDay(challenge.start_date, challenge.duration_days) : undefined
    const progress = userChallenge ? userChallenge.progress : undefined
    const todayCompleted = challengeTasks.some((task) => task.isToday && task.completed)

    const responseData = {
      ...challenge,
      participants: participantsCount || 0,
      duration: `${challenge.duration_days}일`,
      joined: !!userChallenge,
      currentDay,
      progress,
      todayCompleted,
      tasks: challengeTasks,
      completedDays,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("챌린지 조회 오류:", error)
    return NextResponse.json({ message: "챌린지 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 현재 진행 일수 계산 함수
function calculateCurrentDay(startDate: string, totalDays: number): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.min(Math.max(1, diffDays), totalDays)
}

