import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import type { Challenge } from "../types"
import { CHALLENGE_CATEGORIES } from "@/data/challenges"

interface CompletedChallengeCardProps {
  challenge: Challenge
  completedDate: string
}

export function CompletedChallengeCard({ challenge, completedDate }: CompletedChallengeCardProps) {
  const { title, category } = challenge
  const categoryLabel = CHALLENGE_CATEGORIES[category]

  return (
    <Card className="border-gray-200 bg-gray-50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <Badge variant="outline" className="mb-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
              {categoryLabel}
            </Badge>
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">완료일: {completedDate}</p>
      </CardContent>
    </Card>
  )
}

// 확장 고려:
// 1. 챌린지 성취 배지
// 2. 챌린지 결과 통계
// 3. 챌린지 재참여 기능

