"use client"

import { useState } from "react"
import { DashboardLayout } from "@/design/templates/DashboardLayout/DashboardLayout"
import { Card, CardContent } from "@/design/molecules/Card/Card"
import { Button } from "@/design/atoms/Button/Button"
import { Input } from "@/design/atoms/Input/Input"
import { Badge } from "@/design/atoms/Badge/Badge"
import { useGratitude } from "@/features/gratitude/hooks/useGratitude"
import { Calendar, ChevronLeft, ChevronRight, Edit, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

export default function GratitudeJournalPage() {
  const { gratitudeJournals, isLoadingJournals, journalsError, deleteGratitudeJournal } = useGratitude()

  const [searchTerm, setSearchTerm] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 감사일기 검색
  const filteredJournals = gratitudeJournals.filter(
    (journal) =>
      journal.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (journal.tags && journal.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  // 이전 달로 이동
  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  // 다음 달로 이동
  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  // 감사일기 삭제
  const handleDelete = async (id: string) => {
    if (window.confirm("정말로 이 감사일기를 삭제하시겠습니까?")) {
      deleteGratitudeJournal(id)
    }
  }

  // 현재 월 표시
  const currentMonthDisplay = format(currentMonth, "yyyy년 MM월", { locale: ko })

  return (
    <DashboardLayout
      header={
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="container max-w-md mx-auto px-4 flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#1A365D]">내 감사일기</h1>
          </div>
        </header>
      }
    >
      <div className="mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="감사일기 검색"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Card className="border-gray-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-[#1A365D]" />
                <span className="font-medium">{currentMonthDisplay}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {["일", "월", "화", "수", "목", "금", "토"].map((day, i) => (
                <div key={i} className="text-xs font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}

              {/* 캘린더 날짜 표시 (실제 구현에서는 해당 월의 날짜 계산 필요) */}
              {Array.from({ length: 35 }, (_, i) => {
                const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - 5)
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
                const hasJournal = gratitudeJournals.some((j) => j.date.split("T")[0] === format(date, "yyyy-MM-dd"))

                return (
                  <div
                    key={i}
                    className={`
                      h-8 flex items-center justify-center rounded-full text-xs
                      ${isCurrentMonth ? "text-gray-700" : "text-gray-300"}
                      ${hasJournal && isCurrentMonth ? "bg-blue-100 text-blue-700 font-medium" : ""}
                    `}
                  >
                    {date.getDate()}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-[#1A365D]">{searchTerm ? "검색 결과" : "모든 감사일기"}</h2>

          <Link href="/gratitude/new">
            <Button size="sm" className="bg-[#1A365D]">
              새 감사일기
            </Button>
          </Link>
        </div>

        {journalsError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 mb-4">
            {journalsError instanceof Error ? journalsError.message : "감사일기 조회 중 오류가 발생했습니다."}
          </div>
        )}

        {isLoadingJournals ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A365D] mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">{searchTerm ? "검색 결과가 없습니다." : "아직 작성한 감사일기가 없습니다."}</p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                모든 감사일기 보기
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJournals.map((journal) => (
              <Card key={journal.id} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-500">
                      {new Date(journal.date).toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        weekday: "long",
                      })}
                    </p>

                    <div className="flex items-center gap-2">
                      <Link href={`/gratitude/edit/${journal.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => handleDelete(journal.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-800 mb-3">{journal.content}</p>

                  {journal.tags && journal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {journal.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {journal.isPublic && (
                    <Badge
                      variant="outline"
                      className="mt-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      공개
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

