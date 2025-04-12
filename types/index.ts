// 공통 타입 정의
export type ID = number | string

export type Difficulty = "easy" | "medium" | "hard"

export type Category = "bible-reading" | "prayer" | "gratitude" | "memorization" | "worship" | "service"

export interface User {
  id: ID
  name: string
  joinDate: string
  avatar?: string
}

// 확장 고려: 사용자 권한 레벨, 프로필 추가 정보 등

