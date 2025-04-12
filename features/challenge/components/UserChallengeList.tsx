"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UserChallengeCard } from "./UserChallengeCard"
import { CompletedChallengeCard } from "./CompletedChallengeCard"
import { toast } from "@/hooks/use-toast"

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  durationDays: number
  startDate: string
  endDate: string
  totalDays: number
  isPublic: boolean
  progress: number
  daysLeft: number
  currentDay: number
  joined: boolean
  todayCompleted: boolean
  completed?: boolean
  completedAt?: string
}

interface UserChallengeListProps {
  userChallenges: Challenge[]
  completedChallenges: Challenge[]
  isLoading: boolean
  error: unknown
}

export function UserChallengeList({ userChallenges, completedChallenges, isLoading, error }: UserChallengeListProps) {
  const queryClient = useQueryClient()

  // 챌린지 태스크 완료 뮤테이션
  const completeTaskMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const response = await fetch(`/api/challenges/${challengeId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskDay: 0, // 오늘의 태스크 (서버에서 현재 날짜로 계산)
        }),
      })

      if (!response.ok) {
        throw new Error("챌린지 완료 처리 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: () => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["userChallenges"] })
      queryClient.invalidateQueries({ queryKey: ["completedChallenges"] })
      toast({
        title: "오늘의 챌린지를 완료했습니다!",
        description: "내일도 계속 도전해보세요.",
      })
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "챌린지 완료 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  const handleCompleteToday = (challengeId: string) => {
    completeTaskMutation.mutate(challengeId)
  }

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

  if (userChallenges.length === 0 && completedChallenges.length === 0) {
    return <div className="text-center py-8">아직 참여 중인 챌린지가 없습니다.</div>
  }

  return (
    <div className="space-y-6">
      {userChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#1A365D] mb-3">진행 중인 챌린지</h2>
          <div className="space-y-4">
            {userChallenges.map((challenge) => (
              <UserChallengeCard
                key={challenge.id}
                challenge={challenge}
                onCompleteToday={handleCompleteToday}
                isCompleting={completeTaskMutation.isPending}
              />
            ))}
          </div>
        </div>
      )}

      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#1A365D] mb-3">완료한 챌린지</h2>
          <div className="space-y-3">
            {completedChallenges.map((challenge) => (
              <CompletedChallengeCard
                key={challenge.id}
                challenge={challenge}
                completedDate={challenge.completedAt || ""}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

