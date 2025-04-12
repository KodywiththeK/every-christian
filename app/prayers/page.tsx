"use client"

import { useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { DashboardLayout } from "@/design/templates/DashboardLayout/DashboardLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, Clock, Plus } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { toast } from "@/hooks/use-toast"

interface Prayer {
  id: string
  title: string
  content: string
  is_answered: boolean
  is_public: boolean
  start_date: string
  answered_date: string | null
  created_at: string
  updated_at: string | null
  user_id: string
}

export default function PrayersPage() {
  const queryClient = useQueryClient()

  // 기도제목 목록 조회
  const {
    data: prayers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prayers"],
    queryFn: async () => {
      const response = await fetch("/api/prayers")
      if (!response.ok) {
        throw new Error("기도제목을 불러오는 중 오류가 발생했습니다.")
      }
      return response.json() as Promise<Prayer[]>
    },
  })

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
    onSuccess: () => {
      // 성공 시 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["prayers"] })
      toast({
        title: "기도 응답이 표시되었습니다.",
        description: "하나님의 응답에 감사드립니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "기도 응답 표시 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  // 기도 응답 표시
  const handleMarkAsAnswered = (id: string) => {
    if (window.confirm("이 기도제목에 응답을 받으셨나요?")) {
      markAsAnsweredMutation.mutate(id)
    }
  }

  // 활성 기도제목과 응답된 기도제목 분리
  const activePrayers = prayers.filter((prayer) => !prayer.is_answered)
  const answeredPrayers = prayers.filter((prayer) => prayer.is_answered)

  // 에러 처리
  useEffect(() => {
    if (error) {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "기도제목을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }, [error])

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">기도제목</h1>

        <Link href="/prayers/new">
          <Button size="sm" className="flex items-center gap-1 bg-primary">
            <Plus className="h-4 w-4" />
            <span>추가하기</span>
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="active">기도 중</TabsTrigger>
          <TabsTrigger value="answered">응답됨</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : activePrayers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">아직 등록된 기도제목이 없습니다.</p>
              <Link href="/prayers/new">
                <Button variant="link" className="mt-2">
                  새 기도제목 추가하기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activePrayers.map((prayer) => (
                <Card key={prayer.id} className="border-gray-200">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-gray-800 font-medium mb-1">{prayer.title}</p>
                      <p className="text-gray-600 text-sm mb-1">{prayer.content}</p>
                      <p className="text-xs text-gray-500">
                        시작일: {format(new Date(prayer.start_date), "yyyy.MM.dd")}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 border-success-light text-success"
                        onClick={() => handleMarkAsAnswered(prayer.id)}
                        disabled={markAsAnsweredMutation.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="answered">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-gray-600">로딩 중...</p>
            </div>
          ) : answeredPrayers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">아직 응답받은 기도제목이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {answeredPrayers.map((prayer) => (
                <Card key={prayer.id} className="border-gray-200 bg-success-light">
                  <CardHeader className="p-4 pb-1">
                    <div className="flex items-center gap-2">
                      <div className="bg-success-light p-1 rounded-full">
                        <Check className="h-4 w-4 text-success" />
                      </div>
                      <p className="text-success text-sm font-medium">응답됨</p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-gray-800 font-medium mb-1">{prayer.title}</p>
                    <p className="text-gray-600 text-sm mb-2">{prayer.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <p>
                        {format(new Date(prayer.start_date), "yyyy.MM.dd")} ~
                        {prayer.answered_date && format(new Date(prayer.answered_date), " yyyy.MM.dd")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

