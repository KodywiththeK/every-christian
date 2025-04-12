import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function BiblePlanner() {
  const progress = 32 // 32% 완료
  const todayReadings = [
    { id: 1, book: "창세기", chapters: "11-12장", completed: true },
    { id: 2, book: "시편", chapters: "23-24편", completed: true },
    { id: 3, book: "마태복음", chapters: "5장", completed: false },
  ]

  const upcomingReadings = [
    { id: 4, book: "창세기", chapters: "13-14장", day: "내일" },
    { id: 5, book: "시편", chapters: "25-26편", day: "내일" },
    { id: 6, book: "마태복음", chapters: "6장", day: "내일" },
  ]

  return (
    <div className="space-y-6">
      <Card className="border-gray-200">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">성경 1독 진행률</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">32% 완료</span>
              <span className="text-gray-500">남은 기간: 248일</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-medium mb-3">오늘의 읽기</h3>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              {todayReadings.map((reading) => (
                <div key={reading.id} className="flex items-center space-x-2">
                  <Checkbox id={`reading-${reading.id}`} checked={reading.completed} />
                  <Label
                    htmlFor={`reading-${reading.id}`}
                    className={`text-sm font-medium ${
                      reading.completed ? "line-through text-gray-500" : "text-gray-700"
                    }`}
                  >
                    {reading.book} {reading.chapters}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">다음 읽기</h3>
        <Card className="border-gray-200">
          <CardContent className="p-4">
            <div className="space-y-3">
              {upcomingReadings.map((reading) => (
                <div key={reading.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {reading.book} {reading.chapters}
                  </span>
                  <span className="text-xs text-gray-500">{reading.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

