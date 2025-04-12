import { supabase } from '@/lib/supabase'
import type { Challenge, UserChallenge, ChallengeTask, CompletedDay } from '@/features/challenge/types'

// 모든 챌린지 조회
export async function getAllChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase.from('challenges').select('*').eq('is_public', true).order('created_at', { ascending: false })

  if (error) {
    console.error('챌린지 조회 오류:', error)
    throw new Error('챌린지를 불러오는 중 오류가 발생했습니다.')
  }

  // 각 챌린지의 참여자 수 조회
  const challengesWithParticipants = await Promise.all(
    data.map(async (challenge) => {
      const { count, error: countError } = await supabase.from('user_challenges').select('*', { count: 'exact', head: true }).eq('challenge_id', challenge.id)

      if (countError) {
        console.error('참여자 수 조회 오류:', countError)
        return mapChallengeData(challenge, 0)
      }

      return mapChallengeData(challenge, count || 0)
    })
  )

  return challengesWithParticipants
}

// 특정 챌린지 조회
export async function getChallenge(id: string, userId?: string): Promise<Challenge> {
  const { data, error } = await supabase.from('challenges').select('*').eq('id', id).single()

  if (error) {
    console.error('챌린지 조회 오류:', error)
    throw new Error('챌린지를 불러오는 중 오류가 발생했습니다.')
  }

  // 참여자 수 조회
  const { count, error: countError } = await supabase.from('user_challenges').select('*', { count: 'exact', head: true }).eq('challenge_id', id)

  if (countError) {
    console.error('참여자 수 조회 오류:', countError)
  }

  // 사용자가 참여 중인지 확인
  let userChallenge = null
  if (userId) {
    const { data: userChallengeData, error: userChallengeError } = await supabase.from('user_challenges').select('*').eq('challenge_id', id).eq('user_id', userId).single()

    if (!userChallengeError && userChallengeData) {
      userChallenge = userChallengeData
    }
  }

  // 챌린지 태스크 조회
  const { data: tasks, error: tasksError } = await supabase.from('challenge_tasks').select('*').eq('challenge_id', id).order('day', { ascending: true })

  if (tasksError) {
    console.error('챌린지 태스크 조회 오류:', tasksError)
  }

  // 완료한 태스크 조회
  let completedDays: CompletedDay[] = []
  if (userId && userChallenge) {
    const { data: completions, error: completionsError } = await supabase.from('user_task_completions').select('*, challenge_tasks!inner(*)').eq('user_id', userId).in('challenge_tasks.challenge_id', [id]).order('completed_at', { ascending: false })

    if (!completionsError && completions) {
      completedDays = completions.map((completion) => ({
        day: completion.challenge_tasks.day,
        date: completion.completed_at,
      }))
    }
  }

  // 챌린지 태스크 매핑
  const challengeTasks: ChallengeTask[] =
    tasks?.map((task) => {
      const isToday = new Date(task.date).toDateString() === new Date().toDateString()
      const completed = completedDays.some((day) => day.day === task.day)

      return {
        day: task.day,
        date: task.date,
        title: task.title,
        description: task.description || '',
        isToday,
        completed,
      }
    }) || []

  // 현재 진행 상황 계산
  const currentDay = userChallenge ? calculateCurrentDay(data.start_date, data.duration_days) : undefined
  const progress = userChallenge ? userChallenge.progress : undefined
  const todayCompleted = challengeTasks.some((task) => task.isToday && task.completed)

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    category: data.category,
    participants: count || 0,
    duration: `${data.duration_days}일`,
    durationDays: data.duration_days,
    difficulty: data.difficulty,
    createdBy: data.creator_id, // 실제로는 creator의 이름을 가져와야 함
    startDate: data.start_date,
    endDate: data.end_date,
    totalDays: data.duration_days,
    isPublic: data.is_public,
    joined: !!userChallenge,
    currentDay,
    progress,
    todayCompleted,
    tasks: challengeTasks,
    completedDays,
  }
}

// 사용자가 참여 중인 챌린지 조회
export async function getUserChallenges(userId: string): Promise<UserChallenge[]> {
  const { data, error } = await supabase.from('user_challenges').select('*, challenges(*)').eq('user_id', userId).order('created_at', { ascending: false })

  if (error) {
    console.error('사용자 챌린지 조회 오류:', error)
    throw new Error('참여 중인 챌린지를 불러오는 중 오류가 발생했습니다.')
  }

  return data.map((userChallenge) => {
    const challenge = userChallenge.challenges
    const daysLeft = calculateDaysLeft(challenge.end_date)

    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      category: challenge.category,
      participants: 0, // 실제로는 참여자 수를 조회해야 함
      duration: `${challenge.duration_days}일`,
      durationDays: challenge.duration_days,
      difficulty: challenge.difficulty,
      createdBy: challenge.creator_id,
      startDate: userChallenge.start_date,
      endDate: challenge.end_date,
      totalDays: challenge.duration_days,
      isPublic: challenge.is_public,
      progress: userChallenge.progress,
      daysLeft,
      currentDay: calculateCurrentDay(userChallenge.start_date, challenge.duration_days),
      joined: true,
      todayCompleted: false, // 실제로는 오늘의 태스크 완료 여부를 확인해야 함
    }
  })
}

// 사용자가 완료한 챌린지 조회
export async function getCompletedChallenges(userId: string): Promise<Challenge[]> {
  const { data, error } = await supabase.from('user_challenges').select('*, challenges(*)').eq('user_id', userId).eq('completed', true).order('completed_at', { ascending: false })

  if (error) {
    console.error('완료한 챌린지 조회 오류:', error)
    throw new Error('완료한 챌린지를 불러오는 중 오류가 발생했습니다.')
  }

  return data.map((userChallenge) => ({
    id: userChallenge.challenges.id,
    title: userChallenge.challenges.title,
    description: userChallenge.challenges.description,
    category: userChallenge.challenges.category,
    participants: 0, // 실제로는 참여자 수를 조회해야 함
    duration: `${userChallenge.challenges.duration_days}일`,
    durationDays: userChallenge.challenges.duration_days,
    difficulty: userChallenge.challenges.difficulty,
    createdBy: userChallenge.challenges.creator_id,
    startDate: userChallenge.start_date,
    endDate: userChallenge.challenges.end_date,
    totalDays: userChallenge.challenges.duration_days,
    isPublic: userChallenge.challenges.is_public,
  }))
}

// 챌린지 생성
export async function createChallenge(data: Omit<Challenge, 'id' | 'participants' | 'participantsList' | 'tasks' | 'completedDays' | 'joined' | 'todayCompleted' | 'currentDay' | 'progress'>): Promise<Challenge> {
  // 챌린지 생성
  const { data: challenge, error } = await supabase
    .from('challenges')
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      duration_days: data.durationDays,
      start_date: data.startDate,
      end_date: data.endDate,
      is_public: data.isPublic,
      creator_id: data.createdBy,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('챌린지 생성 오류:', error)
    throw new Error('챌린지를 생성하는 중 오류가 발생했습니다.')
  }

  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    participants: 0,
    duration: `${challenge.duration_days}일`,
    durationDays: challenge.duration_days,
    difficulty: challenge.difficulty,
    createdBy: challenge.creator_id,
    startDate: challenge.start_date,
    endDate: challenge.end_date,
    totalDays: challenge.duration_days,
    isPublic: challenge.is_public,
  }
}

// 챌린지 참여
export async function joinChallenge(challengeId: string, userId: string): Promise<void> {
  // 이미 참여 중인지 확인
  const { data: existingParticipation, error: checkError } = await supabase.from('user_challenges').select('*').eq('challenge_id', challengeId).eq('user_id', userId).single()

  if (!checkError && existingParticipation) {
    throw new Error('이미 참여 중인 챌린지입니다.')
  }

  // 챌린지 정보 조회
  const { data: challenge, error: challengeError } = await supabase.from('challenges').select('*').eq('id', challengeId).single()

  if (challengeError) {
    console.error('챌린지 조회 오류:', challengeError)
    throw new Error('챌린지 정보를 불러오는 중 오류가 발생했습니다.')
  }

  // 참여 정보 생성
  const { error } = await supabase.from('user_challenges').insert({
    user_id: userId,
    challenge_id: challengeId,
    progress: 0,
    start_date: new Date().toISOString(),
    created_at: new Date().toISOString(),
  })

  if (error) {
    console.error('챌린지 참여 오류:', error)
    throw new Error('챌린지에 참여하는 중 오류가 발생했습니다.')
  }
}

// 챌린지 태스크 완료
export async function completeTask(challengeId: string, taskDay: number, userId: string): Promise<void> {
  // 태스크 정보 조회
  const { data: task, error: taskError } = await supabase.from('challenge_tasks').select('*').eq('challenge_id', challengeId).eq('day', taskDay).single()

  if (taskError) {
    console.error('태스크 조회 오류:', taskError)
    throw new Error('태스크 정보를 불러오는 중 오류가 발생했습니다.')
  }

  // 이미 완료했는지 확인
  const { data: existingCompletion, error: checkError } = await supabase.from('user_task_completions').select('*').eq('task_id', task.id).eq('user_id', userId).single()

  if (!checkError && existingCompletion) {
    throw new Error('이미 완료한 태스크입니다.')
  }

  // 완료 정보 생성
  const { error: completionError } = await supabase.from('user_task_completions').insert({
    user_id: userId,
    task_id: task.id,
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  })

  if (completionError) {
    console.error('태스크 완료 오류:', completionError)
    throw new Error('태스크를 완료하는 중 오류가 발생했습니다.')
  }

  // 사용자 챌린지 진행 상황 업데이트
  const { data: userChallenge, error: userChallengeError } = await supabase.from('user_challenges').select('*').eq('challenge_id', challengeId).eq('user_id', userId).single()

  if (userChallengeError) {
    console.error('사용자 챌린지 조회 오류:', userChallengeError)
    throw new Error('챌린지 정보를 불러오는 중 오류가 발생했습니다.')
  }

  // 챌린지 정보 조회
  const { data: challenge, error: challengeError } = await supabase.from('challenges').select('*').eq('id', challengeId).single()

  if (challengeError) {
    console.error('챌린지 조회 오류:', challengeError)
    throw new Error('챌린지 정보를 불러오는 중 오류가 발생했습니다.')
  }

  // 완료한 태스크 수 조회
  const { count, error: countError } = await supabase.from('user_task_completions').select('*, challenge_tasks!inner(*)', { count: 'exact', head: true }).eq('user_id', userId).eq('challenge_tasks.challenge_id', challengeId)

  if (countError) {
    console.error('완료한 태스크 수 조회 오류:', countError)
    throw new Error('완료한 태스크 수를 조회하는 중 오류가 발생했습니다.')
  }

  // 진행률 계산
  const progress = Math.round(((count || 0) * 100) / challenge.duration_days)
  const completed = progress >= 100

  // 사용자 챌린지 정보 업데이트
  const updateData: any = {
    progress,
    last_check_in: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (completed && !userChallenge.completed) {
    updateData.completed = true
    updateData.completed_at = new Date().toISOString()
  }

  const { error: updateError } = await supabase.from('user_challenges').update(updateData).eq('id', userChallenge.id)

  if (updateError) {
    console.error('사용자 챌린지 업데이트 오류:', updateError)
    throw new Error('챌린지 진행 상황을 업데이트하는 중 오류가 발생했습니다.')
  }
}

// 유틸리티 함수
function mapChallengeData(challenge: any, participantsCount: number): Challenge {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    category: challenge.category,
    participants: participantsCount,
    duration: `${challenge.duration_days}일`,
    durationDays: challenge.duration_days,
    difficulty: challenge.difficulty,
    createdBy: challenge.creator_id,
    startDate: challenge.start_date,
    endDate: challenge.end_date,
    totalDays: challenge.duration_days,
    isPublic: challenge.is_public,
  }
}

function calculateDaysLeft(endDate: string): number {
  const end = new Date(endDate)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

function calculateCurrentDay(startDate: string, totalDays: number): number {
  const start = new Date(startDate)
  const now = new Date()
  const diffTime = now.getTime() - start.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.min(Math.max(1, diffDays), totalDays)
}
