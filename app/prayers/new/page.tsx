"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, HandIcon as PrayingHands } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

export default function NewPrayerPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  // 기도제목 작성 뮤테이션
  const createPrayerMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; isPublic: boolean }) => {
      const response = await fetch("/api/prayers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "기도제목 작성 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "기도제목이 작성되었습니다.",
        description: "하나님께서 응답해주실 것을 기대합니다.",
      })
      router.push("/prayers")
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "기도제목 작성 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "제목을 입력해주세요.",
        description: "기도제목의 제목을 작성해주세요.",
        variant: "destructive",
      })
      return
    }

    if (!content.trim()) {
      toast({
        title: "내용을 입력해주세요.",
        description: "기도제목의 내용을 작성해주세요.",
        variant: "destructive",
      })
      return
    }

    createPrayerMutation.mutate({
      title,
      content,
      isPublic,
    })
  }

  return (
    <div className="min-h-screen bg-app-bg flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center">
          <Link href="/prayers">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-primary">새 기도제목</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Card className="border-gray-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="bg-info-light p-2 rounded-full">
                  <PrayingHands className="h-5 w-5 text-info" />
                </div>
                <CardTitle className="text-lg">기도제목 추가하기</CardTitle>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prayer-title">제목</Label>
                <Input
                  id="prayer-title"
                  placeholder="기도제목의 제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prayer-content">내용</Label>
                <Textarea
                  id="prayer-content"
                  placeholder="기도제목의 자세한 내용을 적어보세요..."
                  className="min-h-[100px] resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="public-prayer" className="text-sm text-gray-700">
                  다른 사람들과 공유하기
                </Label>
                <Switch id="public-prayer" checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {isPublic && (
                <div className="p-3 bg-info-light rounded-md text-sm text-info">
                  이 기도제목은 익명으로 커뮤니티에 공유됩니다. 다른 크리스찬들이 함께 기도할 수 있습니다.
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={createPrayerMutation.isPending}
              >
                취소
              </Button>
              <Button type="submit" className="bg-primary" disabled={createPrayerMutation.isPending}>
                {createPrayerMutation.isPending ? "저장 중..." : "저장하기"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </main>
    </div>
  )
}

