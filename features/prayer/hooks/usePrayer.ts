"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getPrayers, getPrayer, createPrayer, updatePrayer, deletePrayer } from "@/lib/api/prayer"
import type { Prayer } from "../types"

export function usePrayer() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userId = session?.user?.id

  // 기도제목 목록 조회
  const {
    data: prayers = [],
    isLoading: isLoadingPrayers,
    error: prayersError,
    refetch: refetchPrayers,
  } = useQuery({
    queryKey: ["prayers", userId],
    queryFn: () => (userId ? getPrayers(userId) : Promise.resolve([])),
    enabled: !!userId,
  })

  // 기도제목 생성
  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; isPublic?: boolean }) => {
      if (!userId) throw new Error("로그인이 필요합니다.")

      return createPrayer({
        userId,
        title: data.title,
        content: data.content,
        isAnswered: false,
        isPublic: data.isPublic || false,
        startDate: new Date().toISOString(),
      })
    },
    onSuccess: () => {
      // 성공 시 기도제목 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["prayers", userId] })
    },
  })

  // 기도제목 수정
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Partial<Omit<Prayer, "id" | "userId" | "createdAt" | "updatedAt">> }) => {
      return updatePrayer(id, data)
    },
    onSuccess: () => {
      // 성공 시 기도제목 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["prayers", userId] })
    },
  })

  // 기도제목 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deletePrayer(id)
    },
    onSuccess: () => {
      // 성공 시 기도제목 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["prayers", userId] })
    },
  })

  // 기도 응답 표시
  const markAsAnswered = (id: string) => {
    updateMutation.mutate({
      id,
      data: {
        isAnswered: true,
        answeredDate: new Date().toISOString(),
      },
    })
  }

  // 특정 기도제목 조회 훅
  const usePrayerById = (id: string) => {
    return useQuery({
      queryKey: ["prayer", id, userId],
      queryFn: () => (userId ? getPrayer(id, userId) : Promise.reject("로그인이 필요합니다.")),
      enabled: !!userId && !!id,
    })
  }

  // 활성 기도제목과 응답된 기도제목 분리
  const activePrayers = prayers.filter((prayer) => !prayer.isAnswered)
  const answeredPrayers = prayers.filter((prayer) => prayer.isAnswered)

  return {
    prayers,
    activePrayers,
    answeredPrayers,
    isLoadingPrayers,
    prayersError,
    refetchPrayers,
    usePrayerById,
    createPrayer: createMutation.mutate,
    updatePrayer: updateMutation.mutate,
    deletePrayer: deleteMutation.mutate,
    markAsAnswered,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}

