"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import MainNavigation from "@/components/main-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AnonymousBoard from "@/components/anonymous-board"
import PublicBoard from "@/components/public-board"
import FaqSection from "@/components/faq-section"
import { toast } from "@/hooks/use-toast"

interface Post {
  id: string
  content: string
  pray_count: number
  comment_count: number
  created_at: string
  user_id: string
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("anonymous")

  // 익명 게시판 글 조회
  const {
    data: anonymousPosts = [],
    isLoading: isLoadingAnonymous,
    error: anonymousError,
    refetch: refetchAnonymous,
  } = useQuery({
    queryKey: ["anonymousPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("anonymous_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data as Post[]
    },
  })

  // 공개 게시판 글 조회
  const {
    data: publicPosts = [],
    isLoading: isLoadingPublic,
    error: publicError,
    refetch: refetchPublic,
  } = useQuery({
    queryKey: ["publicPosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("public_posts")
        .select("*, users(name)")
        .order("created_at", { ascending: false })

      if (error) throw error
      return data
    },
  })

  // 실시간 업데이트 구독
  useEffect(() => {
    // 익명 게시판 실시간 구독
    const anonymousSubscription = supabase
      .channel("anonymous_posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "anonymous_posts",
        },
        () => {
          refetchAnonymous()
        },
      )
      .subscribe()

    // 공개 게시판 실시간 구독
    const publicSubscription = supabase
      .channel("public_posts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "public_posts",
        },
        () => {
          refetchPublic()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(anonymousSubscription)
      supabase.removeChannel(publicSubscription)
    }
  }, [refetchAnonymous, refetchPublic])

  // 에러 처리
  useEffect(() => {
    if (anonymousError || publicError) {
      toast({
        title: "오류가 발생했습니다.",
        description: "게시글을 불러오는 중 오류가 발생했습니다.",
        variant: "destructive",
      })
    }
  }, [anonymousError, publicError])

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-primary mb-6">크리스찬 커뮤니티</h1>

        <Tabs defaultValue="anonymous" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="anonymous">익명게시판</TabsTrigger>
            <TabsTrigger value="public">공개게시판</TabsTrigger>
            <TabsTrigger value="faq">신앙 Q&A</TabsTrigger>
          </TabsList>

          <TabsContent value="anonymous">
            <AnonymousBoard posts={anonymousPosts} isLoading={isLoadingAnonymous} />
          </TabsContent>

          <TabsContent value="public">
            <PublicBoard posts={publicPosts} isLoading={isLoadingPublic} />
          </TabsContent>

          <TabsContent value="faq">
            <FaqSection />
          </TabsContent>
        </Tabs>
      </main>

      <MainNavigation />
    </div>
  )
}

