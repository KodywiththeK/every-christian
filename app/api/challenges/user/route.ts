import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// 사용자가 참여 중인 챌린지 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("user_challenges")
      .select("*, challenges(*)")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("사용자 챌린지 조회 오류:", error)
      return NextResponse.json({ message: "참여 중인 챌린지를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    const userChallenges = data.map((userChallenge) => {
      const challenge = userChallenge.challenges
      const daysLeft = calculateDaysLeft(challenge.end_date)

      return {
        id: challenge.id,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        duration: `${challenge.duration_days}일`,
        durationDays: challenge.duration_days,
        difficulty: challenge.difficulty,
        createdBy: challenge.creator_id,
        startDate: userChallenge.start_date,
        endDate: challenge.end_date,
        totalDays: challenge.duration_days,
        isPublic: challenge.is_public,
        progress: userChallenge.progress,
        daysLeft,
        currentDay: calculateCurrentDay(userChallenge.start_date, challenge.duration_days),
        joined: true,
        completed: userChallenge.completed,
        completedAt: userChallenge.completed_at,
        lastCheckIn: userChallenge.last_check_in,
      }
    })

    return NextResponse.json(userChallenges)
  } catch (error) {
    console.error("사용자 챌린지 조회 오류:", error)
    return NextResponse.json({ message: "참여 중인 챌린지를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 남은 일수 계산 함수
function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

// 현재 진행 일수 계산 함수
function calculateCurrentDay(startDate: string, totalDays: number): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.min(Math.max(1, diffDays), totalDays)
}

