import type { ID } from "@/types"

export interface GratitudeJournal {
  id: ID
  userId: ID
  content: string
  date: string
  createdAt: string
  updatedAt?: string
  isPublic?: boolean
  tags?: string[]
}

// 확장 고려:
// 1. 감사일기 카테고리
// 2. 감사일기 이미지 첨부
// 3. 감사일기 공유 설정

