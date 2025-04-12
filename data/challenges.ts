import type { Challenge, UserChallenge } from "@/features/challenge/types"
import type { Category, Difficulty } from "@/types"

// 카테고리 매핑
export const CHALLENGE_CATEGORIES: Record<Category, string> = {
  "bible-reading": "성경 읽기",
  prayer: "기도 생활",
  gratitude: "감사 일기",
  memorization: "말씀 암송",
  worship: "예배/찬양",
  service: "섬김/봉사",
}

// 난이도 매핑
export const CHALLENGE_DIFFICULTIES: Record<Difficulty, string> = {
  easy: "쉬움",
  medium: "보통",
  hard: "어려움",
}

// 모든 챌린지 목록
export const challenges: Challenge[] = [
  {
    id: 1,
    title: "100일 성경 통독",
    description: "100일 동안 성경을 함께 통독해요. 매일 정해진 분량을 읽고 체크인하세요.",
    category: "bible-reading",
    participants: 124,
    duration: "100일",
    durationDays: 100,
    difficulty: "medium",
    createdBy: "믿음이",
    creatorId: 1,
    startDate: "2024.03.01",
    endDate: "2024.06.09",
    totalDays: 100,
    isPublic: true,
    participantsList: [
      { id: 1, name: "믿음이", streak: 35 },
      { id: 2, name: "소망이", streak: 35 },
      { id: 3, name: "사랑이", streak: 34 },
      { id: 4, name: "기쁨이", streak: 33 },
      { id: 5, name: "평화", streak: 31 },
    ],
    tasks: [
      {
        day: 35,
        date: "2024.04.04",
        title: "신명기 1-3장",
        description: "오늘은 신명기 1-3장을 읽고 묵상해보세요.",
        isToday: true,
        completed: false,
      },
      {
        day: 36,
        date: "2024.04.05",
        title: "신명기 4-6장",
        description: "내일은 신명기 4-6장을 읽고 묵상해보세요.",
        isToday: false,
        completed: false,
      },
      {
        day: 37,
        date: "2024.04.06",
        title: "신명기 7-9장",
        description: "신명기 7-9장을 읽고 묵상해보세요.",
        isToday: false,
        completed: false,
      },
    ],
    completedDays: [
      { day: 32, date: "2024.04.01" },
      { day: 33, date: "2024.04.02" },
      { day: 34, date: "2024.04.03" },
    ],
  },
  {
    id: 2,
    title: "21일 감사 훈련",
    description: "21일 동안 매일 3가지 감사할 것을 기록하는 챌린지입니다.",
    category: "gratitude",
    participants: 85,
    duration: "21일",
    durationDays: 21,
    difficulty: "easy",
    createdBy: "소망이",
    creatorId: 2,
    startDate: "2024.03.15",
    endDate: "2024.04.05",
    totalDays: 21,
    isPublic: true,
  },
  {
    id: 3,
    title: "30일 아침 기도",
    description: "30일 동안 아침에 일어나서 10분 이상 기도하는 습관을 기르는 챌린지입니다.",
    category: "prayer",
    participants: 67,
    duration: "30일",
    durationDays: 30,
    difficulty: "hard",
    createdBy: "사랑이",
    creatorId: 3,
    startDate: "2024.03.10",
    endDate: "2024.04.09",
    totalDays: 30,
    isPublic: true,
  },
  {
    id: 4,
    title: "말씀 암송 챌린지",
    description: "7일 동안 매일 한 구절씩 말씀을 암송하는 챌린지입니다.",
    category: "memorization",
    participants: 43,
    duration: "7일",
    durationDays: 7,
    difficulty: "medium",
    createdBy: "기쁨이",
    creatorId: 4,
    startDate: "2024.03.25",
    endDate: "2024.04.01",
    totalDays: 7,
    isPublic: true,
  },
]

// 사용자가 참여 중인 챌린지
export const userChallenges: UserChallenge[] = [
  {
    ...challenges[0],
    progress: 35,
    daysLeft: 65,
    currentDay: 35,
    joined: true,
    todayCompleted: false,
  },
  {
    ...challenges[1],
    progress: 67,
    daysLeft: 7,
    currentDay: 14,
    joined: true,
    todayCompleted: false,
  },
]

// 사용자가 완료한 챌린지
export const completedChallenges: Challenge[] = [
  {
    id: 5,
    title: "7일 새벽 기도",
    description: "7일 동안 매일 새벽 기도에 참석하는 챌린지입니다.",
    category: "prayer",
    participants: 32,
    duration: "7일",
    durationDays: 7,
    difficulty: "medium",
    createdBy: "평화",
    creatorId: 5,
    startDate: "2024.03.05",
    endDate: "2024.03.12",
    totalDays: 7,
    isPublic: true,
  },
]

// 확장 고려: 챌린지 카테고리별 필터링, 인기 챌린지, 추천 챌린지 등

