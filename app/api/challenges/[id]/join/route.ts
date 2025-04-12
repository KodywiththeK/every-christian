import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

// 챌린지 참여
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 이미 참여 중인지 확인
    const { data: existingParticipation, error: checkError } = await supabase
      .from("user_challenges")
      .select("*")
      .eq("challenge_id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (!checkError && existingParticipation) {
      return NextResponse.json({ message: "이미 참여 중인 챌린지입니다." }, { status: 400 })
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

    // 참여 정보 생성
    const { data, error } = await supabase
      .from("user_challenges")
      .insert({
        user_id: session.user.id,
        challenge_id: params.id,
        progress: 0,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("챌린지 참여 오류:", error)
      return NextResponse.json({ message: "챌린지에 참여하는 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({ message: "챌린지에 참여했습니다.", participation: data })
  } catch (error) {
    console.error("챌린지 참여 오류:", error)
    return NextResponse.json({ message: "챌린지에 참여하는 중 오류가 발생했습니다." }, { status: 500 })
  }
}

