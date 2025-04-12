"use client"

import { useQuery } from "@tanstack/react-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import MainNavigation from "@/shared/components/MainNavigation"
import { ChallengeList } from "@/features/challenge/components/ChallengeList"
import { UserChallengeList } from "@/features/challenge/components/UserChallengeList"
import { toast } from "@/hooks/use-toast"

export default function ChallengePage() {
  // 모든 챌린지 목록 조회
  const {
    data: allChallenges = [],
    isLoading: isLoadingAllChallenges,
    error: allChallengesError,
  } = useQuery({
    queryKey: ["challenges"],
    queryFn: async () => {
      const response = await fetch("/api/challenges")
      if (!response.ok) {
        throw new Error("챌린지를 불러오는 중 오류가 발생했습니다.")
      }
      return response.json()
    },
  })

  // 사용자가 참여 중인 챌린지 조회
  const {
    data: userChallenges = [],
    isLoading: isLoadingUserChallenges,
    error: userChallengesError,
  } = useQuery({
    queryKey: ["userChallenges"],
    queryFn: async () => {
      const response = await fetch("/api/challenges/user")
      if (!response.ok) {
        throw new Error("참여 중인 챌린지를 불러오는 중 오류가 발생했습니다.")
      }
      return response.json()
    },
  })

  // 사용자가 완료한 챌린지 조회
  const { data: completedChallenges = [], isLoading: isLoadingCompletedChallenges } = useQuery({
    queryKey: ["completedChallenges"],
    queryFn: async () => {
      const response = await fetch("/api/challenges/completed")
      if (!response.ok) {
        throw new Error("완료한 챌린지를 불러오는 중 오류가 발생했습니다.")
      }
      return response.json()
    },
  })

  // 에러 처리
  if (allChallengesError || userChallengesError) {
    toast({
      title: "오류가 발생했습니다.",
      description: "챌린지 정보를 불러오는 중 오류가 발생했습니다.",
      variant: "destructive",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">믿음의 챌린지</h1>

          <Link href="/challenges/new">
            <Button size="sm" className="flex items-center gap-1 bg-primary">
              <Plus className="h-4 w-4" />
              <span>새 챌린지</span>
            </Button>
          </Link>
        </div>

        <p className="text-gray-600 mb-6">함께 신앙 생활을 성장시킬 수 있는 다양한 챌린지에 참여해보세요.</p>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="all">모든 챌린지</TabsTrigger>
            <TabsTrigger value="my">내 챌린지</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ChallengeList challenges={allChallenges} isLoading={isLoadingAllChallenges} error={allChallengesError} />
          </TabsContent>

          <TabsContent value="my">
            <UserChallengeList
              userChallenges={userChallenges}
              completedChallenges={completedChallenges}
              isLoading={isLoadingUserChallenges}
              error={userChallengesError}
            />
          </TabsContent>
        </Tabs>
      </main>

      <MainNavigation />
    </div>
  )
}

