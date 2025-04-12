"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function NewGratitudePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [gratitude, setGratitude] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  })

  // 감사일기 작성 뮤테이션
  const createGratitudeMutation = useMutation({
    mutationFn: async (data: { content: string; isPublic: boolean }) => {
      const response = await fetch("/api/gratitude", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "감사일기 작성 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "감사일기가 작성되었습니다.",
        description: "소중한 감사의 순간을 기록했습니다.",
      })
      router.push("/gratitude")
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "감사일기 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!gratitude.trim()) {
      toast({
        title: "내용을 입력해주세요.",
        description: "감사한 일에 대한 내용을 작성해주세요.",
        variant: "destructive",
      })
      return
    }

    createGratitudeMutation.mutate({
      content: gratitude,
      isPublic,
    })
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center">
          <Link href="/gratitude">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-primary">감사일기 작성</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-red-100 p-2 rounded-full">
                  <Heart className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="text-lg">오늘 감사한 일</CardTitle>
              </div>
              <p className="text-sm text-gray-500">{today}</p>
            </CardHeader>

            <CardContent>
              <Textarea
                placeholder="오늘 하루 감사했던 일을 적어보세요..."
                className="min-h-[150px] resize-none"
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
              />

              <div className="flex items-center space-x-2 mt-4">
                <Switch id="public-mode" checked={isPublic} onCheckedChange={setIsPublic} />
                <Label htmlFor="public-mode">다른 사람들과 공유하기</Label>
              </div>

              {isPublic && (
                <p className="text-sm text-info mt-2 bg-info-light p-2 rounded">
                  이 감사일기는 커뮤니티에 익명으로 공유됩니다. 다른 크리스찬들에게 영감을 줄 수 있습니다.
                </p>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createGratitudeMutation.isPending}
              >
                취소
              </Button>
              <Button type="submit" className="bg-primary" disabled={createGratitudeMutation.isPending}>
                {createGratitudeMutation.isPending ? "저장 중..." : "저장하기"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}

