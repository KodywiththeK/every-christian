import { NextResponse } from "next/server"
import { z } from "zod"
import { users } from "@/data/users"

// 회원가입 유효성 검사 스키마
const registerSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다."),
  email: z.string().email("유효한 이메일 주소를 입력해주세요."),
  password: z.string().min(6, "비밀번호는 6자 이상이어야 합니다."),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // 유효성 검사
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: result.error.errors[0].message }, { status: 400 })
    }

    const { name, email, password } = body

    // 이메일 중복 확인
    const existingUser = users.find((user) => user.email === email)

    if (existingUser) {
      return NextResponse.json({ message: "이미 사용 중인 이메일입니다." }, { status: 400 })
    }

    // 새 사용자 생성 (실제로는 데이터베이스에 저장)
    const newUser = {
      id: String(users.length + 1),
      name,
      email,
      password, // 실제 구현에서는 비밀번호 해싱 필요
      image: null,
    }

    users.push(newUser)

    // 민감한 정보 제외하고 응답
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({ message: "회원가입이 완료되었습니다.", user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("회원가입 오류:", error)
    return NextResponse.json({ message: "회원가입 처리 중 오류가 발생했습니다." }, { status: 500 })
  }
}

