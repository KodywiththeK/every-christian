import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import MainNavigation from "@/components/main-navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { PenSquare } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import GratitudeList from "@/components/gratitude-list"

export default async function GratitudePage() {
  const today = new Date()
  const session = await getServerSession(authOptions)

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">감사일기</h1>

          <Link href="/gratitude/new">
            <Button size="sm" className="flex items-center gap-1 bg-primary">
              <PenSquare className="h-4 w-4" />
              <span>작성하기</span>
            </Button>
          </Link>
        </div>

        <Card className="border-gray-200 mb-6">
          <CardContent className="p-0">
            <Calendar mode="single" selected={today} className="rounded-md" />
          </CardContent>
        </Card>

        <h2 className="text-lg font-medium text-primary mb-3">오늘의 감사</h2>

        <Suspense fallback={<GratitudeItemSkeleton />}>
          <TodayGratitude userId={session?.user?.id} />
        </Suspense>

        <h2 className="text-lg font-medium text-primary mb-3 mt-6">이전 감사일기</h2>

        <Suspense fallback={<GratitudeListSkeleton />}>
          <PreviousGratitude userId={session?.user?.id} />
        </Suspense>
      </main>

      <MainNavigation />
    </div>
  )
}

// 오늘의 감사일기 (서버 컴포넌트)
async function TodayGratitude({ userId }: { userId?: string }) {
  if (!userId) return <GratitudeItemSkeleton />

  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: todayGratitude } = await supabase
    .from("gratitude_journals")
    .select("*")
    .eq("user_id", userId)
    .gte("date", today)
    .lt("date", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString())
    .limit(1)
    .single()

  if (!todayGratitude) {
    return (
      <Card className="border-gray-200 mb-4">
        <CardContent className="p-4 text-center">
          <p className="text-gray-500">오늘 작성한 감사일기가 없습니다.</p>
          <Link href="/gratitude/new">
            <Button variant="link" className="mt-2">
              지금 작성하기
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-gray-200 mb-4">
      <CardContent className="p-4">
        <p className="text-sm text-gray-500 mb-1">
          {new Date(todayGratitude.date).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
        <p className="text-gray-800">{todayGratitude.content}</p>
      </CardContent>
    </Card>
  )
}

// 이전 감사일기 목록 (서버 컴포넌트)
async function PreviousGratitude({ userId }: { userId?: string }) {
  if (!userId) return <GratitudeListSkeleton />

  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: gratitudes } = await supabase
    .from("gratitude_journals")
    .select("*")
    .eq("user_id", userId)
    .lt("date", today)
    .order("date", { ascending: false })
    .limit(5)

  return <GratitudeList gratitudes={gratitudes || []} />
}

// 스켈레톤 로딩 상태
function GratitudeItemSkeleton() {
  return (
    <Card className="border-gray-200 mb-4">
      <CardContent className="p-4">
        <Skeleton className="h-4 w-1/3 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
    </Card>
  )
}

function GratitudeListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border-gray-200">
          <CardContent className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

