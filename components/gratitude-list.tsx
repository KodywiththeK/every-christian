"use client"

import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Gratitude {
  id: string
  content: string
  date: string
  is_public: boolean
  tags?: string[]
}

interface GratitudeListProps {
  gratitudes: Gratitude[]
}

export default function GratitudeList({ gratitudes }: GratitudeListProps) {
  if (gratitudes.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-500">아직 작성한 감사일기가 없습니다.</p>
        <Link href="/gratitude/new">
          <Button variant="link" className="mt-2">
            첫 감사일기 작성하기
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {gratitudes.map((gratitude) => (
        <Card key={gratitude.id} className="border-gray-200">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">
              {format(new Date(gratitude.date), "yyyy년 MM월 dd일", { locale: ko })}
            </p>
            <p className="text-gray-800">
              {gratitude.content.length > 100 ? `${gratitude.content.substring(0, 100)}...` : gratitude.content}
            </p>
          </CardContent>
        </Card>
      ))}

      {gratitudes.length >= 5 && (
        <div className="text-center mt-4">
          <Link href="/profile/gratitude">
            <Button variant="outline">더 보기</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

