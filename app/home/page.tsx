import { Suspense } from "react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import DailyVerse from "@/components/daily-verse"
import GratitudeReminder from "@/components/gratitude-reminder"
import MainNavigation from "@/components/main-navigation"
import PrayerRequests from "@/components/prayer-requests"
import QuickActions from "@/components/quick-actions"
import { Skeleton } from "@/components/ui/skeleton"

// 홈페이지 (서버 컴포넌트)
export default async function HomePage() {
  const session = await getServerSession(authOptions)
  const supabase = createServerSupabaseClient()

  // 사용자 이름 가져오기
  const userName = session?.user?.name || "크리스찬"

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-primary mb-6">안녕하세요, {userName}님 👋</h1>

        <DailyVerse />

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-primary mb-3">오늘의 기도제목</h2>
          <Suspense fallback={<PrayerRequestsSkeleton />}>
            <PrayerRequestsWrapper userId={session?.user?.id} />
          </Suspense>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-primary mb-3">빠른 실행</h2>
          <QuickActions />
        </div>

        <Suspense fallback={<GratitudeReminderSkeleton />}>
          <GratitudeReminderWrapper userId={session?.user?.id} />
        </Suspense>
      </main>

      <MainNavigation />
    </div>
  )
}

// 기도제목 래퍼 (서버 컴포넌트)
async function PrayerRequestsWrapper({ userId }: { userId?: string }) {
  if (!userId) return <PrayerRequests prayers={[]} />

  const supabase = createServerSupabaseClient()

  const { data: prayers } = await supabase
    .from("prayers")
    .select("*")
    .eq("user_id", userId)
    .eq("is_answered", false)
    .order("created_at", { ascending: false })
    .limit(3)

  return <PrayerRequests prayers={prayers || []} />
}

// 감사일기 래퍼 (서버 컴포넌트)
async function GratitudeReminderWrapper({ userId }: { userId?: string }) {
  if (!userId) return <GratitudeReminder hasGratitudeToday={false} />

  const supabase = createServerSupabaseClient()
  const today = new Date().toISOString().split("T")[0]

  const { data: todayGratitude } = await supabase
    .from("gratitude_journals")
    .select("*")
    .eq("user_id", userId)
    .gte("date", today)
    .lt("date", new Date(new Date().setDate(new Date().getDate() + 1)).toISOString())
    .limit(1)

  return <GratitudeReminder hasGratitudeToday={todayGratitude && todayGratitude.length > 0} />
}

// 스켈레톤 로딩 상태
function PrayerRequestsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}

function GratitudeReminderSkeleton() {
  return (
    <div className="mt-8">
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  )
}

