import { Check } from "lucide-react"
import type { CompletedDay } from "../types"

interface CompletedDaysListProps {
  completedDays: CompletedDay[]
}

export function CompletedDaysList({ completedDays }: CompletedDaysListProps) {
  return (
    <div className="flex overflow-x-auto space-x-2 pb-2">
      {completedDays.map((day, index) => (
        <div
          key={index}
          className="flex-shrink-0 bg-green-50 border border-green-200 rounded-md p-3 flex flex-col items-center"
        >
          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mb-1">
            <Check className="h-4 w-4 text-green-600" />
          </div>
          <p className="text-xs font-medium">Day {day.day}</p>
          <p className="text-xs text-gray-500">{day.date}</p>
        </div>
      ))}
    </div>
  )
}

// 확장 고려:
// 1. 완료일 캘린더 뷰
// 2. 완료일 통계
// 3. 스트릭 시각화

