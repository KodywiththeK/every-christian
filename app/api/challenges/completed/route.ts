import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// 사용자가 완료한 챌린지 조회
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
      .eq("completed", true)
      .order("completed_at", { ascending: false })

    if (error) {
      console.error("완료한 챌린지 조회 오류:", error)
      return NextResponse.json({ message: "완료한 챌린지를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
    }

    const completedChallenges = data.map((userChallenge) => ({
      id: userChallenge.challenges.id,
      title: userChallenge.challenges.title,
      description: userChallenge.challenges.description,
      category: userChallenge.challenges.category,
      duration: `${userChallenge.challenges.duration_days}일`,
      durationDays: userChallenge.challenges.duration_days,
      difficulty: userChallenge.challenges.difficulty,
      createdBy: userChallenge.challenges.creator_id,
      startDate: userChallenge.start_date,
      endDate: userChallenge.challenges.end_date,
      totalDays: userChallenge.challenges.duration_days,
      isPublic: userChallenge.challenges.is_public,
      completedAt: userChallenge.completed_at,
    }))

    return NextResponse.json(completedChallenges)
  } catch (error) {
    console.error("완료한 챌린지 조회 오류:", error)
    return NextResponse.json({ message: "완료한 챌린지를 불러오는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

