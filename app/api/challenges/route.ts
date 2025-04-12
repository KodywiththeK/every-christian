import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

// 챌린지 생성 유효성 검사 스키마
const challengeSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  category: z.string().min(1, "카테고리를 선택해주세요."),
  difficulty: z.string().min(1, "난이도를 선택해주세요."),
  durationDays: z.number().min(1, "기간은 최소 1일 이상이어야 합니다."),
  startDate: z.string().min(1, "시작일을 선택해주세요."),
  endDate: z.string().min(1, "종료일을 선택해주세요."),
  isPublic: z.boolean().default(true),
  tasks: z
    .array(
      z.object({
        day: z.number(),
        title: z.string(),
        description: z.string().optional(),
        date: z.string(),
      }),
    )
    .optional(),
})

// 모든 챌린지 목록 조회
export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("챌린지 조회 오류:", error)
      return NextResponse.json({ message: "챌린지 조회 중 오류가 발생했습니다." }, { status: 500 })
    }

    // 각 챌린지의 참여자 수 조회
    const challengesWithParticipants = await Promise.all(
      data.map(async (challenge) => {
        const { count, error: countError } = await supabase
          .from("user_challenges")
          .select("*", { count: "exact", head: true })
          .eq("challenge_id", challenge.id)

        if (countError) {
          console.error("참여자 수 조회 오류:", countError)
          return { ...challenge, participants: 0 }
        }

        return { ...challenge, participants: count || 0 }
      }),
    )

    return NextResponse.json(challengesWithParticipants)
  } catch (error) {
    console.error("챌린지 조회 오류:", error)
    return NextResponse.json({ message: "챌린지 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 챌린지 생성
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const body = await req.json()

    // 유효성 검사
    const result = challengeSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { title, description, category, difficulty, durationDays, startDate, endDate, isPublic, tasks } = result.data

    const supabase = createRouteHandlerClient({ cookies })

    // 트랜잭션 처리를 위한 함수
    const createChallengeWithTasks = async () => {
      // 1. 챌린지 생성
      const { data: challenge, error: challengeError } = await supabase
        .from("challenges")
        .insert({
          title,
          description,
          category,
          difficulty,
          duration_days: durationDays,
          start_date: startDate,
          end_date: endDate,
          is_public: isPublic,
          creator_id: session.user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (challengeError) throw challengeError

      // 2. 챌린지 태스크 생성 (있는 경우)
      if (tasks && tasks.length > 0) {
        const tasksToInsert = tasks.map((task) => ({
          challenge_id: challenge.id,
          day: task.day,
          title: task.title,
          description: task.description || null,
          date: task.date,
          created_at: new Date().toISOString(),
        }))

        const { error: tasksError } = await supabase.from("challenge_tasks").insert(tasksToInsert)

        if (tasksError) throw tasksError
      }

      // 3. 생성자를 첫 번째 참여자로 등록
      const { error: participantError } = await supabase.from("user_challenges").insert({
        user_id: session.user.id,
        challenge_id: challenge.id,
        progress: 0,
        start_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      })

      if (participantError) throw participantError

      return challenge
    }

    // 트랜잭션 실행
    try {
      const challenge = await createChallengeWithTasks()
      return NextResponse.json({ message: "챌린지가 생성되었습니다.", challenge }, { status: 201 })
    } catch (error) {
      console.error("챌린지 생성 트랜잭션 오류:", error)
      return NextResponse.json({ message: "챌린지 생성 중 오류가 발생했습니다." }, { status: 500 })
    }
  } catch (error) {
    console.error("챌린지 생성 오류:", error)
    return NextResponse.json({ message: "챌린지 생성 중 오류가 발생했습니다." }, { status: 500 })
  }
}

