"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
  getAllChallenges,
  getChallenge,
  getUserChallenges,
  getCompletedChallenges,
  createChallenge,
  joinChallenge,
  completeTask,
} from "@/lib/api/challenge"
import type { Challenge } from "../types"

export function useChallenge(challengeId?: string) {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userId = session?.user?.id

  // 특정 챌린지 조회
  const {
    data: challenge,
    isLoading: isLoadingChallenge,
    error: challengeError,
    refetch: refetchChallenge,
  } = useQuery({
    queryKey: ["challenge", challengeId, userId],
    queryFn: () => (challengeId ? getChallenge(challengeId, userId) : Promise.reject("챌린지 ID가 필요합니다.")),
    enabled: !!challengeId,
  })

  // 모든 챌린지 조회
  const {
    data: allChallenges = [],
    isLoading: isLoadingAllChallenges,
    error: allChallengesError,
    refetch: refetchAllChallenges,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: getAllChallenges,
  })

  // 사용자가 참여 중인 챌린지 조회
  const {
    data: userChallenges = [],
    isLoading: isLoadingUserChallenges,
    error: userChallengesError,
    refetch: refetchUserChallenges,
  } = useQuery({
    queryKey: ["userChallenges", userId],
    queryFn: () => (userId ? getUserChallenges(userId) : Promise.resolve([])),
    enabled: !!userId,
  })

  // 사용자가 완료한 챌린지 조회
  const {
    data: completedChallenges = [],
    isLoading: isLoadingCompletedChallenges,
    error: completedChallengesError,
    refetch: refetchCompletedChallenges,
  } = useQuery({
    queryKey: ["completedChallenges", userId],
    queryFn: () => (userId ? getCompletedChallenges(userId) : Promise.resolve([])),
    enabled: !!userId,
  })

  // 챌린지 생성
  const createMutation = useMutation({
    mutationFn: (
      data: Omit<
        Challenge,
        | "id"
        | "participants"
        | "participantsList"
        | "tasks"
        | "completedDays"
        | "joined"
        | "todayCompleted"
        | "currentDay"
        | "progress"
      >,
    ) => {
      if (!userId) throw new Error("로그인이 필요합니다.")

      return createChallenge({
        ...data,
        createdBy: userId,
      })
    },
    onSuccess: () => {
      // 성공 시 챌린지 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["challenges"] })
    },
  })

  // 챌린지 참여
  const joinMutation = useMutation({
    mutationFn: (challengeId: string) => {
      if (!userId) throw new Error("로그인이 필요합니다.")

      return joinChallenge(challengeId, userId)
    },
    onSuccess: () => {
      // 성공 시 관련 데이터 갱신
      if (challengeId) {
        queryClient.invalidateQueries({ queryKey: ["challenge", challengeId, userId] })
      }
      queryClient.invalidateQueries({ queryKey: ["userChallenges", userId] })
    },
  })

  // 챌린지 태스크 완료
  const completeTaskMutation = useMutation({
    mutationFn: ({ challengeId, taskDay }: { challengeId: string; taskDay: number }) => {
      if (!userId) throw new Error("로그인이 필요합니다.")

      return completeTask(challengeId, taskDay, userId)
    },
    onSuccess: () => {
      // 성공 시 관련 데이터 갱신
      if (challengeId) {
        queryClient.invalidateQueries({ queryKey: ["challenge", challengeId, userId] })
      }
      queryClient.invalidateQueries({ queryKey: ["userChallenges", userId] })
      queryClient.invalidateQueries({ queryKey: ["completedChallenges", userId] })
    },
  })

  return {
    challenge,
    allChallenges,
    userChallenges,
    completedChallenges,
    isLoadingChallenge,
    isLoadingAllChallenges,
    isLoadingUserChallenges,
    isLoadingCompletedChallenges,
    challengeError,
    allChallengesError,
    userChallengesError,
    completedChallengesError,
    refetchChallenge,
    refetchAllChallenges,
    refetchUserChallenges,
    refetchCompletedChallenges,
    createChallenge: createMutation.mutate,
    joinChallenge: joinMutation.mutate,
    completeTask: completeTaskMutation.mutate,
    isCreating: createMutation.isPending,
    isJoining: joinMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
    createError: createMutation.error,
    joinError: joinMutation.error,
    completeError: completeTaskMutation.error,
  }
}

