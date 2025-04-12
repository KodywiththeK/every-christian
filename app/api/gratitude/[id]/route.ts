import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { z } from "zod"

// 감사일기 수정 유효성 검사 스키마
const gratitudeUpdateSchema = z.object({
  content: z.string().min(1, "내용을 입력해주세요.").optional(),
  isPublic: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

// 감사일기 조회
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { data, error } = await supabase
      .from("gratitude_journals")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (error) {
      console.error("감사일기 조회 오류:", error)
      return NextResponse.json({ message: "감사일기를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("감사일기 조회 오류:", error)
    return NextResponse.json({ message: "감사일기 조회 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 감사일기 수정
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 감사일기 존재 및 소유권 확인
    const { data: journal, error: checkError } = await supabase
      .from("gratitude_journals")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError) {
      return NextResponse.json({ message: "감사일기를 찾을 수 없습니다." }, { status: 404 })
    }

    const body = await req.json()

    // 유효성 검사
    const result = gratitudeUpdateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (result.data.content !== undefined) updateData.content = result.data.content
    if (result.data.isPublic !== undefined) updateData.is_public = result.data.isPublic
    if (result.data.tags !== undefined) updateData.tags = result.data.tags

    const { data, error } = await supabase
      .from("gratitude_journals")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("감사일기 수정 오류:", error)
      return NextResponse.json({ message: "감사일기 수정 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      message: "감사일기가 수정되었습니다.",
      gratitudeJournal: data,
    })
  } catch (error) {
    console.error("감사일기 수정 오류:", error)
    return NextResponse.json({ message: "감사일기 수정 중 오류가 발생했습니다." }, { status: 500 })
  }
}

// 감사일기 삭제
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // 감사일기 존재 및 소유권 확인
    const { data: journal, error: checkError } = await supabase
      .from("gratitude_journals")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", session.user.id)
      .single()

    if (checkError) {
      return NextResponse.json({ message: "감사일기를 찾을 수 없습니다." }, { status: 404 })
    }

    const { error } = await supabase.from("gratitude_journals").delete().eq("id", params.id)

    if (error) {
      console.error("감사일기 삭제 오류:", error)
      return NextResponse.json({ message: "감사일기 삭제 중 오류가 발생했습니다." }, { status: 500 })
    }

    return NextResponse.json({
      message: "감사일기가 삭제되었습니다.",
    })
  } catch (error) {
    console.error("감사일기 삭제 오류:", error)
    return NextResponse.json({ message: "감사일기 삭제 중 오류가 발생했습니다." }, { status: 500 })
  }
}

