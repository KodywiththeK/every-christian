import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users } from "lucide-react"
import Link from "next/link"
import type { Challenge } from "../types"
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from "@/data/challenges"

interface ChallengeCardProps {
  challenge: Challenge
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  const { id, title, description, category, participants, duration, difficulty } = challenge

  const categoryLabel = CHALLENGE_CATEGORIES[category]
  const difficultyLabel = CHALLENGE_DIFFICULTIES[difficulty]

  return (
    <Card className="border-gray-200 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="mb-2 bg-info-light text-info hover:bg-info-light border-info-light">
              {categoryLabel}
            </Badge>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Badge
            variant="outline"
            className={`
            ${
              difficulty === "easy"
                ? "bg-success-light text-success border-success-light"
                : difficulty === "medium"
                  ? "bg-warning-light text-warning border-warning-light"
                  : "bg-error-light text-error border-error-light"
            }
          `}
          >
            {difficultyLabel}
          </Badge>
        </div>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{participants}명 참여 중</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Link href={`/challenges/${id}`} className="w-full">
          <Button className="w-full bg-primary">상세 보기</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

// 확장 고려:
// 1. 챌린지 카드 크기 변형 (compact, expanded)
// 2. 참여 중인 챌린지 표시
// 3. 인기 챌린지 배지

