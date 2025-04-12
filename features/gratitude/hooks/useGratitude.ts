"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import {
  getGratitudeJournals,
  getGratitudeJournal,
  createGratitudeJournal,
  updateGratitudeJournal,
  deleteGratitudeJournal,
} from "@/lib/api/gratitude"
import type { GratitudeJournal } from "../types"

export function useGratitude() {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  const userId = session?.user?.id

  // 감사일기 목록 조회
  const {
    data: gratitudeJournals = [],
    isLoading: isLoadingJournals,
    error: journalsError,
    refetch: refetchJournals,
  } = useQuery({
    queryKey: ["gratitudeJournals", userId],
    queryFn: () => (userId ? getGratitudeJournals(userId) : Promise.resolve([])),
    enabled: !!userId,
  })

  // 감사일기 생성
  const createMutation = useMutation({
    mutationFn: (data: { content: string; isPublic?: boolean; tags?: string[] }) => {
      if (!userId) throw new Error("로그인이 필요합니다.")

      return createGratitudeJournal({
        userId,
        content: data.content,
        date: new Date().toISOString(),
        isPublic: data.isPublic || false,
        tags: data.tags || [],
      })
    },
    onSuccess: () => {
      // 성공 시 감사일기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["gratitudeJournals", userId] })
    },
  })

  // 감사일기 수정
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Partial<Omit<GratitudeJournal, "id" | "userId" | "createdAt" | "updatedAt">> }) => {
      return updateGratitudeJournal(id, data)
    },
    onSuccess: () => {
      // 성공 시 감사일기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["gratitudeJournals", userId] })
    },
  })

  // 감사일기 삭제
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteGratitudeJournal(id)
    },
    onSuccess: () => {
      // 성공 시 감사일기 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["gratitudeJournals", userId] })
    },
  })

  // 특정 날짜의 감사일기 조회
  const getGratitudeJournalByDate = (date: string) => {
    return gratitudeJournals.find((journal) => {
      const journalDate = new Date(journal.date).toISOString().split("T")[0]
      return journalDate === date
    })
  }

  // 특정 감사일기 조회 훅
  const useGratitudeJournalById = (id: string) => {
    return useQuery({
      queryKey: ["gratitudeJournal", id, userId],
      queryFn: () => (userId ? getGratitudeJournal(id, userId) : Promise.reject("로그인이 필요합니다.")),
      enabled: !!userId && !!id,
    })
  }

  return {
    gratitudeJournals,
    isLoadingJournals,
    journalsError,
    refetchJournals,
    getGratitudeJournalByDate,
    useGratitudeJournalById,
    createGratitudeJournal: createMutation.mutate,
    updateGratitudeJournal: updateMutation.mutate,
    deleteGratitudeJournal: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    createError: createMutation.error,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
  }
}

