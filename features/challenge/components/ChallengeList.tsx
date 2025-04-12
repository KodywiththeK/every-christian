"use client"

import { ChallengeCard } from "./ChallengeCard"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration_days: number
  participants: number
  start_date: string
  end_date: string
  is_public: boolean
  creator_id: string
}

interface ChallengeListProps {
  challenges: Challenge[]
  isLoading: boolean
  error: unknown
}

export function ChallengeList({ challenges, isLoading, error }: ChallengeListProps) {
  if (isLoading) {
    return <div className="text-center py-8">챌린지를 불러오는 중...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error instanceof Error ? error.message : "챌린지를 불러오는 중 오류가 발생했습니다."}
      </div>
    )
  }

  if (challenges.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">아직 등록된 챌린지가 없습니다.</p>
        <Link href="/challenges/new">
          <Button variant="link" className="mt-2">
            첫 챌린지 만들기
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <ChallengeCard key={challenge.id} challenge={challenge} />
      ))}
    </div>
  )
}

