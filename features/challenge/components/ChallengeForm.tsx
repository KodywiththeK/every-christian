"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy } from "lucide-react"
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from "@/data/challenges"
import type { Category, Difficulty } from "@/types"
import { useChallenge } from "../hooks/useChallenge"

interface ChallengeFormProps {
  onCancel: () => void
}

export function ChallengeForm({ onCancel }: ChallengeFormProps) {
  const router = useRouter()
  const { createChallenge, loading, error } = useChallenge()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<Category>("bible-reading")
  const [difficulty, setDifficulty] = useState<Difficulty>("medium")
  const [duration, setDuration] = useState("30")
  const [startDate, setStartDate] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [tasks, setTasks] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !difficulty || !duration || !startDate || !tasks) {
      return
    }

    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Number.parseInt(duration))

    const newChallenge = {
      title,
      description,
      category,
      difficulty,
      duration: `${duration}일`,
      durationDays: Number.parseInt(duration),
      startDate,
      endDate: endDate.toISOString().split("T")[0],
      totalDays: Number.parseInt(duration),
      participants: 1,
      createdBy: "현재 사용자", // 실제 구현에서는 현재 로그인한 사용자 정보 사용
      isPublic,
      tasks: tasks.split("\n").map((task, index) => ({
        day: index + 1,
        title: task,
        description: "",
        date: new Date(new Date(startDate).setDate(new Date(startDate).getDate() + index)).toISOString().split("T")[0],
        isToday: false,
        completed: false,
      })),
    }

    const result = await createChallenge(newChallenge)

    if (result.success) {
      router.push("/challenges")
    }
  }

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <Trophy className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle className="text-lg">챌린지 정보</CardTitle>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="challenge-title">챌린지 제목</Label>
            <Input
              id="challenge-title"
              placeholder="챌린지 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenge-description">챌린지 설명</Label>
            <Textarea
              id="challenge-description"
              placeholder="챌린지에 대한 자세한 설명을 적어주세요..."
              className="min-h-[100px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-category">카테고리</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                <SelectTrigger id="challenge-category">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHALLENGE_CATEGORIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-difficulty">난이도</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as Difficulty)}>
                <SelectTrigger id="challenge-difficulty">
                  <SelectValue placeholder="난이도 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHALLENGE_DIFFICULTIES).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-duration">기간 (일)</Label>
              <Input
                id="challenge-duration"
                type="number"
                placeholder="30"
                min="1"
                max="365"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="challenge-start-date">시작일</Label>
              <div className="flex items-center relative">
                <Input
                  id="challenge-start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <Calendar className="absolute right-3 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="public-challenge" className="text-sm text-gray-700">
              다른 사람들에게 공개하기
            </Label>
            <Switch id="public-challenge" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <div className="p-3 bg-blue-50 rounded-md text-sm text-blue-700">
              공개된 챌린지는 모든 사용자가 볼 수 있고 참여할 수 있습니다.
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="challenge-tasks">챌린지 내용</Label>
            <Textarea
              id="challenge-tasks"
              placeholder="챌린지 참여자들이 매일 해야 할 일을 설명해주세요. 예: '매일 성경 3장 읽기', '아침마다 10분 기도하기' 등"
              className="min-h-[100px] resize-none"
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              required
            />
          </div>

          {error && <div className="p-3 bg-red-50 rounded-md text-sm text-red-700">{error}</div>}
        </CardContent>

        <CardFooter className="flex justify-end gap-2 border-t pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            취소
          </Button>
          <Button type="submit" className="bg-[#1A365D]" disabled={loading}>
            {loading ? "처리 중..." : "챌린지 만들기"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

// 확장 고려:
// 1. 챌린지 템플릿 선택
// 2. 챌린지 이미지 업로드
// 3. 챌린지 태그 추가
// 4. 챌린지 반복 설정 (주간, 월간 등)

