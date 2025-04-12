import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users } from "lucide-react"
import Link from "next/link"

export default function ChallengeList() {
  const challenges = [
    {
      id: 1,
      title: "100일 성경 통독",
      description: "100일 동안 성경을 함께 통독해요. 매일 정해진 분량을 읽고 체크인하세요.",
      category: "성경 읽기",
      participants: 124,
      duration: "100일",
      difficulty: "보통",
    },
    {
      id: 2,
      title: "21일 감사 훈련",
      description: "21일 동안 매일 3가지 감사할 것을 기록하는 챌린지입니다.",
      category: "감사 일기",
      participants: 85,
      duration: "21일",
      difficulty: "쉬움",
    },
    {
      id: 3,
      title: "30일 아침 기도",
      description: "30일 동안 아침에 일어나서 10분 이상 기도하는 습관을 기르는 챌린지입니다.",
      category: "기도 생활",
      participants: 67,
      duration: "30일",
      difficulty: "어려움",
    },
    {
      id: 4,
      title: "말씀 암송 챌린지",
      description: "7일 동안 매일 한 구절씩 말씀을 암송하는 챌린지입니다.",
      category: "말씀 암송",
      participants: 43,
      duration: "7일",
      difficulty: "보통",
    },
  ]

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="border-gray-200 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                  {challenge.category}
                </Badge>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
              </div>
              <Badge
                variant="outline"
                className={`
                  ${
                    challenge.difficulty === "쉬움"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : challenge.difficulty === "보통"
                        ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-red-50 text-red-700 border-red-200"
                  }
                `}
              >
                {challenge.difficulty}
              </Badge>
            </div>
            <CardDescription className="text-gray-600">{challenge.description}</CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{challenge.participants}명 참여 중</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{challenge.duration}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Link href={`/challenges/${challenge.id}`} className="w-full">
              <Button className="w-full bg-[#1A365D]">상세 보기</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

