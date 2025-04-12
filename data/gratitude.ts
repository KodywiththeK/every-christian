import type { GratitudeJournal } from "@/features/gratitude/types"

// 초기 감사일기 데이터
const gratitudeJournalsData: GratitudeJournal[] = [
  {
    id: "1",
    userId: "1",
    content: "오늘 교회 모임에서 좋은 사람들을 만나 감사합니다. 함께 기도하고 말씀 나누는 시간이 정말 소중했어요.",
    date: "2024-03-29",
    createdAt: "2024-03-29T18:30:00Z",
    isPublic: false,
  },
  {
    id: "2",
    userId: "1",
    content: "오늘 비가 왔지만 우산을 가져간 것에 감사합니다. 작은 준비가 하루를 편안하게 만들었어요.",
    date: "2024-03-28",
    createdAt: "2024-03-28T20:15:00Z",
    isPublic: false,
  },
  {
    id: "3",
    userId: "1",
    content: "오늘 가족과 함께한 저녁 식사 시간이 즐거웠습니다. 건강하게 함께할 수 있어 감사해요.",
    date: "2024-03-27",
    createdAt: "2024-03-27T19:45:00Z",
    isPublic: true,
    tags: ["가족", "식사"],
  },
  {
    id: "4",
    userId: "1",
    content: "오늘 성경 읽기 목표를 달성했습니다. 꾸준히 말씀을 읽을 수 있게 도와주신 하나님께 감사드립니다.",
    date: "2024-03-26",
    createdAt: "2024-03-26T21:00:00Z",
    isPublic: true,
    tags: ["성경", "목표"],
  },
  {
    id: "5",
    userId: "1",
    content: "오늘 친구의 생일을 기억하고 축하해줄 수 있어서 감사합니다. 작은 선물이 친구에게 큰 기쁨이 되었어요.",
    date: "2024-03-25",
    createdAt: "2024-03-25T22:10:00Z",
    isPublic: false,
  },
]

// 감사일기 데이터 관리 함수
export const gratitudeJournals = {
  // 사용자별 감사일기 조회
  getByUserId: (userId: string) => {
    return gratitudeJournalsData.filter((journal) => journal.userId === userId)
  },

  // 특정 감사일기 조회
  getById: (id: string) => {
    return gratitudeJournalsData.find((journal) => journal.id === id)
  },

  // 감사일기 생성
  create: (data: Omit<GratitudeJournal, "id" | "createdAt">) => {
    const newJournal: GratitudeJournal = {
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      ...data,
    }

    gratitudeJournalsData.push(newJournal)
    return newJournal
  },

  // 감사일기 수정
  update: (id: string, data: Partial<GratitudeJournal>) => {
    const index = gratitudeJournalsData.findIndex((journal) => journal.id === id)

    if (index === -1) return null

    const updatedJournal = {
      ...gratitudeJournalsData[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }

    gratitudeJournalsData[index] = updatedJournal
    return updatedJournal
  },

  // 감사일기 삭제
  delete: (id: string) => {
    const index = gratitudeJournalsData.findIndex((journal) => journal.id === id)

    if (index === -1) return false

    gratitudeJournalsData.splice(index, 1)
    return true
  },
}

