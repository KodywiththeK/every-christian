"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flag, MessageCircle, PenSquare, HandIcon as PrayingHands } from "lucide-react"
import Link from "next/link"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"
import { toast } from "@/hooks/use-toast"

interface Post {
  id: string
  content: string
  pray_count: number
  comment_count: number
  created_at: string
  user_id: string
}

interface AnonymousBoardProps {
  posts: Post[]
  isLoading: boolean
}

export default function AnonymousBoard({ posts, isLoading }: AnonymousBoardProps) {
  const queryClient = useQueryClient()

  // 기도하기 뮤테이션
  const prayMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/community/anonymous/${postId}/pray`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("기도하기 처리 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["anonymousPosts"] })
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "기도하기 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  // 신고하기 뮤테이션
  const reportMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await fetch(`/api/community/anonymous/${postId}/report`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("신고 처리 중 오류가 발생했습니다.")
      }

      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "신고가 접수되었습니다.",
        description: "관리자가 검토 후 조치할 예정입니다.",
      })
    },
    onError: (error) => {
      toast({
        title: "오류가 발생했습니다.",
        description: error instanceof Error ? error.message : "신고 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    },
  })

  const handlePray = (postId: string) => {
    prayMutation.mutate(postId)
  }

  const handleReport = (postId: string) => {
    if (window.confirm("이 게시글을 신고하시겠습니까?")) {
      reportMutation.mutate(postId)
    }
  }

  // 시간 포맷팅 함수
  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: ko })
    } catch (error) {
      return "알 수 없음"
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-gray-600">로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">익명으로 기도제목과 고민을 나눠보세요</p>
        <Link href="/community/anonymous/new">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" />
            <span>글쓰기</span>
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">아직 작성된 게시글이 없습니다.</p>
          <Link href="/community/anonymous/new">
            <Button variant="link" className="mt-2">
              첫 게시글 작성하기
            </Button>
          </Link>
        </div>
      ) : (
        posts.map((post) => (
          <Card key={post.id} className="border-gray-200">
            <CardContent className="p-4">
              <p className="text-gray-800 mb-2">{post.content}</p>
              <p className="text-xs text-gray-500">{formatTime(post.created_at)}</p>
            </CardContent>
            <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-auto"
                  onClick={() => handlePray(post.id)}
                  disabled={prayMutation.isPending}
                >
                  <PrayingHands className="h-4 w-4" />
                  <span>기도해요 {post.pray_count}</span>
                </Button>

                <Link href={`/community/anonymous/${post.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 h-auto"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comment_count}</span>
                  </Button>
                </Link>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-500 hover:bg-transparent p-1 h-auto"
                onClick={() => handleReport(post.id)}
                disabled={reportMutation.isPending}
              >
                <Flag className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  )
}

