"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Check, Plus } from "lucide-react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

interface Prayer {
  id: string
  title: string
  content: string
  is_answered: boolean
  user_id: string
}

interface PrayerRequestsProps {
  prayers: Prayer[]
}

export default function PrayerRequests({ prayers }: PrayerRequestsProps) {
  const queryClient = useQueryClient()
  const [optimisticPrayers, setOptimisticPrayers] = useState(prayers)

  // 기도 응답 표시 뮤테이션
  const markAsAnsweredMutation = useMutation({
    mutationFn: async (prayerId: string) => {
      const response = await fetch(`/api/prayers/${prayerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isAnswered: true,
          answeredDate: new Date().toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("기도 응답 표시 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onMutate: async (prayerId) => {
      // 낙관적 업데이트
      setOptimisticPrayers((prev) => prev.filter((prayer) => prayer.id !== prayerId))
    },
    onSuccess: () => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["prayers"] })
    },
  })

  const handleMarkAsAnswered = (prayerId: string) => {
    markAsAnsweredMutation.mutate(prayerId)
  }

  return (
    <div className="space-y-3">
      {optimisticPrayers.map((prayer) => (
        <Card key={prayer.id} className="border border-gray-200">
          <CardContent className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center bg-blue-100 text-blue-600"></div>
              <p className="text-gray-800">{prayer.title}</p>
            </div>
            <button
              onClick={() => handleMarkAsAnswered(prayer.id)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-green-500 hover:bg-green-50 transition-colors"
            >
              <Check className="h-4 w-4" />
            </button>
          </CardContent>
        </Card>
      ))}

      <Link
        href="/prayers"
        className="flex items-center justify-center p-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        <span>새 기도제목 추가하기</span>
      </Link>
    </div>
  )
}

