import type { ID, Category, Difficulty } from "@/types"

export interface ChallengeTask {
  day: number
  date: string
  title: string
  description: string
  isToday: boolean
  completed: boolean
}

export interface CompletedDay {
  day: number
  date: string
}

export interface ChallengeParticipant {
  id: ID
  name: string
  streak: number
  avatar?: string
}

export interface Challenge {
  id: ID
  title: string
  description: string
  category: Category
  participants: number
  participantsList?: ChallengeParticipant[]
  duration: string
  durationDays: number
  difficulty: Difficulty
  createdBy: string
  creatorId?: ID
  startDate: string
  endDate: string
  progress?: number
  currentDay?: number
  totalDays: number
  joined?: boolean
  todayCompleted?: boolean
  tasks?: ChallengeTask[]
  completedDays?: CompletedDay[]
  isPublic: boolean
}

export interface UserChallenge extends Challenge {
  progress: number
  daysLeft: number
  todayCompleted: boolean
}

// 확장 고려: 챌린지 템플릿, 반복 챌린지, 팀 챌린지, 챌린지 성취 배지 등

