"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, CheckCircle2 } from "lucide-react"
import type { ChallengeTask } from "../types"

interface ChallengeTaskListProps {
  tasks: ChallengeTask[]
  onCompleteTask: (day: number) => void
}

export function ChallengeTaskList({ tasks, onCompleteTask }: ChallengeTaskListProps) {
  const handleCompleteTask = (day: number) => {
    onCompleteTask(day)
  }

  return (
    <div className="space-y-3">
      {tasks.map((task, index) => (
        <Card key={index} className={`border-gray-200 ${task.isToday ? "border-blue-300 border-2" : ""}`}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Day {task.day}
                  </Badge>
                  {task.isToday && <Badge className="bg-blue-500">오늘</Badge>}
                </div>
                <h3 className="font-medium mt-2">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                <p className="text-xs text-gray-500 mt-1">{task.date}</p>
              </div>

              {task.isToday && !task.completed && (
                <Button size="sm" className="bg-[#1A365D]" onClick={() => handleCompleteTask(task.day)}>
                  <Check className="h-4 w-4 mr-1" />
                  완료하기
                </Button>
              )}

              {task.completed && (
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// 확장 고려:
// 1. 태스크 상세 보기
// 2. 태스크 메모 추가
// 3. 태스크 알림 설정

