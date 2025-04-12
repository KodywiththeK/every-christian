"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CHALLENGE_CATEGORIES } from "@/data/challenges"

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: string
  duration: string
  durationDays: number
  startDate: string
  endDate: string
  totalDays: number
  isPublic: boolean
  progress: number
  daysLeft: number
  currentDay: number
  joined: boolean
  todayCompleted: boolean
}

interface UserChallengeCardProps {
  challenge: Challenge
  onCompleteToday: (challengeId: string) => void
  isCompleting: boolean
}

export function UserChallengeCard({ challenge, onCompleteToday, isCompleting }: UserChallengeCardProps) {
  const { id, title, category, progress, daysLeft, startDate, endDate, todayCompleted } = challenge

  const categoryLabel = CHALLENGE_CATEGORIES[category as keyof typeof CHALLENGE_CATEGORIES] || category

  const handleCompleteClick = () => {
    onCompleteToday(id)
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-info-light text-info hover:bg-info-light border-info-light">
              {categoryLabel}
            </Badge>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          {todayCompleted ? (
            <Badge className="bg-success hover:bg-success">오늘 완료</Badge>
          ) : (
            <Badge
              variant="outline"
              className="bg-warning-light text-warning hover:bg-warning-light border-warning-light"
            >
              미완료
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{progress}% 완료</span>
            <span className="text-gray-500">남은 기간: {daysLeft}일</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{startDate.split("T")[0].replace(/-/g, ".")}</span>
            <span>{endDate.split("T")[0].replace(/-/g, ".")}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/challenges/${id}`} className={todayCompleted ? "w-full" : "hidden"}>
          <Button variant="outline" className="w-full">
            상세 보기
          </Button>
        </Link>
        {!todayCompleted && (
          <Button className="w-full bg-primary" onClick={handleCompleteClick} disabled={isCompleting}>
            {isCompleting ? "처리 중..." : "오늘 챌린지 완료하기"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

