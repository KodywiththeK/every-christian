import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function MyChallenges() {
  const myChallenges = [
    {
      id: 1,
      title: "100일 성경 통독",
      category: "성경 읽기",
      progress: 35,
      daysLeft: 65,
      startDate: "2024.03.01",
      endDate: "2024.06.09",
      todayCompleted: true,
    },
    {
      id: 2,
      title: "21일 감사 훈련",
      category: "감사 일기",
      progress: 67,
      daysLeft: 7,
      startDate: "2024.03.15",
      endDate: "2024.04.05",
      todayCompleted: false,
    },
  ]

  const completedChallenges = [
    {
      id: 3,
      title: "7일 새벽 기도",
      category: "기도 생활",
      completedDate: "2024.03.12",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-[#1A365D] mb-3">진행 중인 챌린지</h2>
        <div className="space-y-4">
          {myChallenges.map((challenge) => (
            <Card key={challenge.id} className="border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge
                      variant="outline"
                      className="mb-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      {challenge.category}
                    </Badge>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </div>
                  {challenge.todayCompleted ? (
                    <Badge className="bg-green-500 hover:bg-green-600">오늘 완료</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200">
                      미완료
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{challenge.progress}% 완료</span>
                    <span className="text-gray-500">남은 기간: {challenge.daysLeft}일</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{challenge.startDate}</span>
                    <span>{challenge.endDate}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Link href={`/challenges/${challenge.id}`} className="w-full">
                  <Button
                    variant={challenge.todayCompleted ? "outline" : "default"}
                    className={`w-full ${!challenge.todayCompleted ? "bg-[#1A365D]" : ""}`}
                  >
                    {challenge.todayCompleted ? "상세 보기" : "오늘 챌린지 완료하기"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {completedChallenges.length > 0 && (
        <div>
          <h2 className="text-lg font-medium text-[#1A365D] mb-3">완료한 챌린지</h2>
          <div className="space-y-3">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id} className="border-gray-200 bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge
                        variant="outline"
                        className="mb-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                      >
                        {challenge.category}
                      </Badge>
                      <h3 className="font-medium">{challenge.title}</h3>
                    </div>
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">완료일: {challenge.completedDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

