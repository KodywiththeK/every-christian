"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, ArrowLeft, Calendar, CheckCircle2, Clock, Flame, Medal, Users } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import MainNavigation from "@/shared/components/MainNavigation"
import { useChallenge } from "@/features/challenge/hooks/useChallenge"
import { ChallengeParticipantsList } from "@/features/challenge/components/ChallengeParticipantsList"
import { ChallengeTaskList } from "@/features/challenge/components/ChallengeTaskList"
import { CompletedDaysList } from "@/features/challenge/components/CompletedDaysList"
import { CHALLENGE_CATEGORIES, CHALLENGE_DIFFICULTIES } from "@/data/challenges"

export default function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const { challenge, joinChallenge, completeTask, loading, error } = useChallenge(params.id)
  const [isJoining, setIsJoining] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)

  const handleJoinChallenge = async () => {
    if (!challenge) return

    setIsJoining(true)
    await joinChallenge(challenge.id)
    setIsJoining(false)
  }

  const handleCompleteTask = async (day: number) => {
    if (!challenge) return

    setIsCompleting(true)
    await completeTask(challenge.id, day)
    setIsCompleting(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="container max-w-md mx-auto px-4 flex items-center">
            <Link href="/challenges">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#1A365D]">챌린지 상세</h1>
          </div>
        </header>
        <main className="flex-1 container max-w-md mx-auto px-4 py-6 flex items-center justify-center">
          <p>챌린지 정보를 불러오는 중...</p>
        </main>
        <MainNavigation />
      </div>
    )
  }

  if (error || !challenge) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F6F2]">
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="container max-w-md mx-auto px-4 flex items-center">
            <Link href="/challenges">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-[#1A365D]">챌린지 상세</h1>
          </div>
        </header>
        <main className="flex-1 container max-w-md mx-auto px-4 py-6 flex items-center justify-center">
          <p className="text-red-500">{error || "챌린지를 찾을 수 없습니다."}</p>
        </main>
        <MainNavigation />
      </div>
    )
  }

  const categoryLabel = CHALLENGE_CATEGORIES[challenge.category]
  const difficultyLabel = CHALLENGE_DIFFICULTIES[challenge.difficulty]

  return (
    <div className="flex flex-col min-h-screen bg-app-bg">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center">
          <Link href="/challenges">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-primary">챌린지 상세</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="border-gray-200">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className="mb-2 bg-info-light text-info hover:bg-info-light border-info-light">
                {categoryLabel}
              </Badge>
              <Badge
                variant="outline"
                className={`
                ${
                  challenge.difficulty === "easy"
                    ? "bg-success-light text-success border-success-light"
                    : challenge.difficulty === "medium"
                      ? "bg-warning-light text-warning border-warning-light"
                      : "bg-error-light text-error border-error-light"
                }
              `}
              >
                {difficultyLabel}
              </Badge>
            </div>
            <CardTitle className="text-xl">{challenge.title}</CardTitle>
            <CardDescription className="text-gray-600">{challenge.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-y-2 justify-between text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{challenge.participants}명 참여 중</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{challenge.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>
                  {challenge.startDate} ~ {challenge.endDate}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Medal className="h-4 w-4" />
                <span>개설자: {challenge.createdBy}</span>
              </div>
            </div>

            {challenge.joined && challenge.progress !== undefined && (
              <div className="mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 font-medium">
                    {challenge.currentDay}/{challenge.totalDays}일 ({challenge.progress}%)
                  </span>
                  <span className="text-gray-500">D+{challenge.currentDay}</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
            )}

            {challenge.joined ? (
              challenge.todayCompleted ? (
                <div className="bg-success-light border border-success-light rounded-md p-3 flex items-center gap-2 text-success mb-4">
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                  <p>오늘의 챌린지를 완료했습니다! 내일도 계속해보세요.</p>
                </div>
              ) : (
                <Alert className="mb-4 bg-warning-light border-warning-light">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertTitle className="text-warning">오늘의 챌린지가 있습니다</AlertTitle>
                  <AlertDescription className="text-warning">
                    아래 오늘의 챌린지를 완료하고 체크인해보세요.
                  </AlertDescription>
                </Alert>
              )
            ) : (
              <Button className="w-full bg-primary mb-4" onClick={handleJoinChallenge} disabled={isJoining}>
                {isJoining ? "처리 중..." : "이 챌린지 참여하기"}
              </Button>
            )}

            {challenge.participantsList && (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-primary">참여자 목록</h3>
                  <Link href={`/challenges/${challenge.id}/participants`} className="text-sm text-info">
                    전체 보기
                  </Link>
                </div>

                <ChallengeParticipantsList participants={challenge.participantsList} />
              </>
            )}
          </CardContent>
        </Card>

        {challenge.joined && challenge.tasks && (
          <div>
            <h2 className="text-lg font-medium text-primary mb-3">챌린지 일정</h2>

            <ChallengeTaskList tasks={challenge.tasks} onCompleteTask={handleCompleteTask} />

            {challenge.completedDays && challenge.completedDays.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-primary mb-2">최근 완료한 날</h3>
                <CompletedDaysList completedDays={challenge.completedDays} />
              </div>
            )}
          </div>
        )}
      </main>

      {challenge.joined && !challenge.todayCompleted && (
        <div className="sticky bottom-16 w-full px-4 py-3 bg-white border-t border-gray-200">
          <Button
            className="w-full bg-primary"
            onClick={() => challenge.tasks && handleCompleteTask(challenge.tasks.find((t) => t.isToday)?.day || 0)}
            disabled={isCompleting}
          >
            <Flame className="h-4 w-4 mr-2" />
            {isCompleting ? "처리 중..." : "오늘의 챌린지 완료하기"}
          </Button>
        </div>
      )}

      <MainNavigation />
    </div>
  )
}

