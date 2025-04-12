import type { ID } from "@/types"

export interface Prayer {
  id: ID
  userId: ID
  title: string
  content: string
  isAnswered: boolean
  isPublic: boolean
  startDate: string
  answeredDate?: string
  createdAt: string
  updatedAt?: string
}

