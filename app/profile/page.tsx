"use client"

import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { DashboardLayout } from "@/design/templates/DashboardLayout/DashboardLayout"
import { Card, CardContent } from "@/design/molecules/Card/Card"
import { Button } from "@/design/atoms/Button/Button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, BookOpen, ChevronRight, Heart, LogOut, HandIcon as PrayingHands, Settings } from "lucide-react"
import { useGratitude } from "@/features/gratitude/hooks/useGratitude"

export default function ProfilePage() {
  const { data: session } = useSession()
  const { gratitudeJournals } = useGratitude()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  // 사용자 이니셜 생성
  const getUserInitials = () => {
    if (!session?.user?.name) return "사용"

    const nameParts = session.user.name.split(" ")
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2)
    }

    return nameParts
      .map((part) => part.charAt(0))
      .join("")
      .substring(0, 2)
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-primary mb-6">내 정보</h1>

      <Card className="border-gray-200 mb-6">
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              {session?.user?.image ? (
                <AvatarImage src={session.user.image} alt={session.user.name || "사용자"} />
              ) : (
                <AvatarFallback className="bg-primary text-white text-xl">{getUserInitials()}</AvatarFallback>
              )}
            </Avatar>

            <div>
              <h2 className="text-xl font-semibold">{session?.user?.name || "사용자"}님</h2>
              <p className="text-gray-500">{session?.user?.email}</p>
              <Button variant="link" className="p-0 h-auto text-info">
                프로필 수정
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-medium text-primary mb-3">나의 활동</h2>

      <Card className="border-gray-200 mb-6">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 divide-x">
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{gratitudeJournals.length}</p>
              <p className="text-sm text-gray-500">감사일기</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">8</p>
              <p className="text-sm text-gray-500">기도제목</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">32%</p>
              <p className="text-sm text-gray-500">성경 읽기</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-medium text-[#1A365D] mb-3">설정</h2>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <ul className="divide-y">
            <li>
              <Button variant="ghost" className="w-full justify-start rounded-none py-4 px-5">
                <Bell className="h-5 w-5 mr-3 text-gray-500" />
                <span className="flex-1 text-left">알림 설정</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start rounded-none py-4 px-5">
                <PrayingHands className="h-5 w-5 mr-3 text-gray-500" />
                <span className="flex-1 text-left">기도 시간 알림</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start rounded-none py-4 px-5">
                <BookOpen className="h-5 w-5 mr-3 text-gray-500" />
                <span className="flex-1 text-left">성경 버전 설정</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start rounded-none py-4 px-5">
                <Heart className="h-5 w-5 mr-3 text-gray-500" />
                <span className="flex-1 text-left">감사일기 알림</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start rounded-none py-4 px-5">
                <Settings className="h-5 w-5 mr-3 text-gray-500" />
                <span className="flex-1 text-left">앱 설정</span>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className="w-full justify-start rounded-none py-4 px-5 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">로그아웃</span>
              </Button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}

