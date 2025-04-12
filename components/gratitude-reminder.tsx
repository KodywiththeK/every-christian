"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

interface GratitudeReminderProps {
  hasGratitudeToday: boolean
}

export default function GratitudeReminder({ hasGratitudeToday }: GratitudeReminderProps) {
  return (
    <Card className="mt-8 border-none bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-medium">
            {hasGratitudeToday ? "오늘의 감사일기를 작성했어요!" : "오늘 감사한 일이 있었나요?"}
          </h3>
        </div>

        <p className="text-white/80 text-sm mb-4">
          {hasGratitudeToday
            ? "매일 감사하는 습관이 행복을 가져다 줍니다. 내일도 잊지 마세요!"
            : "하루를 마무리하며 감사한 일을 기록해보세요. 작은 것에도 감사하는 습관이 행복을 가져다 줍니다."}
        </p>

        <Link href={hasGratitudeToday ? "/gratitude" : "/gratitude/new"}>
          <Button className="w-full bg-white text-primary hover:bg-white/90">
            {hasGratitudeToday ? "감사일기 모아보기" : "감사일기 작성하기"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

