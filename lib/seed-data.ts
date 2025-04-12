import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with the service role key for admin privileges
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey)

// 개발자 계정 정보
const DEVELOPER_ID = '00000000-0000-0000-0000-000000000001' // 유효한 UUID 형식으로 변경
const DEVELOPER_EMAIL = 'developer@everychristian.com'
const DEVELOPER_NAME = '개발자'

export async function seedDatabase() {
  try {
    console.log('Starting database seeding...')

    // 개발자 계정 생성 또는 업데이트
    const { data: existingDeveloper } = await supabase.from('users').select('*').eq('id', DEVELOPER_ID).single()

    if (!existingDeveloper) {
      await supabase.from('users').insert({
        id: DEVELOPER_ID,
        email: DEVELOPER_EMAIL,
        name: DEVELOPER_NAME,
        created_at: new Date().toISOString(),
      })
      console.log('Created developer user')
    }

    // Create a test user if it doesn't exist
    // Note: In a real app, users would be created through auth signup
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const { data: existingUser } = await supabase.from('users').select('*').eq('id', testUserId).single()

    if (!existingUser) {
      await supabase.from('users').insert({
        id: testUserId,
        email: 'test@example.com',
        name: '테스트 사용자',
        created_at: new Date().toISOString(),
      })
      console.log('Created test user')
    }

    // Seed challenges
    const challenges = [
      {
        id: '11111111-1111-1111-1111-111111111111',
        title: '100일 성경 통독',
        description: '100일 동안 성경을 함께 통독해요. 매일 정해진 분량을 읽고 체크인하세요.',
        category: 'bible-reading',
        difficulty: 'medium',
        duration_days: 100,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_public: true,
        creator_id: DEVELOPER_ID, // 개발자 ID로 변경
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        title: '21일 감사 훈련',
        description: '21일 동안 매일 3가지 감사할 것을 기록하는 챌린지입니다.',
        category: 'gratitude',
        difficulty: 'easy',
        duration_days: 21,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_public: true,
        creator_id: DEVELOPER_ID, // 개발자 ID로 변경
      },
      {
        id: '33333333-3333-3333-3333-333333333333',
        title: '30일 아침 기도',
        description: '30일 동안 아침에 일어나서 10분 이상 기도하는 습관을 기르는 챌린지입니다.',
        category: 'prayer',
        difficulty: 'hard',
        duration_days: 30,
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_public: true,
        creator_id: DEVELOPER_ID, // 개발자 ID로 변경
      },
    ]

    // Insert challenges
    for (const challenge of challenges) {
      const { data: existingChallenge } = await supabase.from('challenges').select('*').eq('id', challenge.id).single()

      if (!existingChallenge) {
        await supabase.from('challenges').insert(challenge)
        console.log(`Created challenge: ${challenge.title}`)

        // Create challenge tasks
        const tasks = []
        for (let day = 1; day <= challenge.duration_days; day++) {
          const taskDate = new Date()
          taskDate.setDate(taskDate.getDate() + day - 1)

          let title = ''
          let description = ''

          if (challenge.category === 'bible-reading') {
            title = `성경 읽기 Day ${day}`
            description = `오늘의 성경 읽기: ${getRandomBibleReading()}`
          } else if (challenge.category === 'gratitude') {
            title = `감사일기 Day ${day}`
            description = '오늘 감사한 일 3가지를 기록해보세요.'
          } else if (challenge.category === 'prayer') {
            title = `아침 기도 Day ${day}`
            description = '아침에 10분 이상 기도하고 체크인하세요.'
          }

          tasks.push({
            challenge_id: challenge.id,
            day,
            title,
            description,
            date: taskDate.toISOString().split('T')[0],
          })
        }

        if (tasks.length > 0) {
          await supabase.from('challenge_tasks').insert(tasks)
          console.log(`Created ${tasks.length} tasks for challenge: ${challenge.title}`)
        }

        // Join the user to the challenge
        await supabase.from('user_challenges').insert({
          user_id: DEVELOPER_ID, // 개발자 ID로 변경
          challenge_id: challenge.id,
          progress: 0,
          start_date: new Date().toISOString(),
          completed: false,
        })
        console.log(`User joined challenge: ${challenge.title}`)
      }
    }

    // Seed gratitude journals
    const gratitudeJournals = [
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '오늘 교회 모임에서 좋은 사람들을 만나 감사합니다. 함께 기도하고 말씀 나누는 시간이 정말 소중했어요.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_public: false,
        tags: ['교회', '모임', '교제'],
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '오늘 비가 왔지만 우산을 가져간 것에 감사합니다. 작은 준비가 하루를 편안하게 만들었어요.',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        is_public: false,
        tags: ['일상', '감사'],
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '오늘 가족과 함께한 저녁 식사 시간이 즐거웠습니다. 건강하게 함께할 수 있어 감사해요.',
        date: new Date().toISOString().split('T')[0],
        is_public: true,
        tags: ['가족', '식사', '감사'],
      },
    ]

    // Insert gratitude journals
    const { data: existingJournals } = await supabase.from('gratitude_journals').select('*').eq('user_id', DEVELOPER_ID)

    if (!existingJournals || existingJournals.length === 0) {
      await supabase.from('gratitude_journals').insert(gratitudeJournals)
      console.log(`Created ${gratitudeJournals.length} gratitude journals`)
    }

    // Seed prayers
    const prayers = [
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '가족의 건강을 위해',
        content: '가족 모두가 건강하게 지낼 수 있도록 기도합니다.',
        is_answered: false,
        is_public: false,
        start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '직장에서의 지혜',
        content: '직장에서 올바른 결정을 내릴 수 있는 지혜를 주시길 기도합니다.',
        is_answered: false,
        is_public: true,
        start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '시험 합격을 위해',
        content: '다가오는 시험에 합격할 수 있도록 기도합니다.',
        is_answered: true,
        is_public: false,
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        answered_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    // Insert prayers
    const { data: existingPrayers } = await supabase.from('prayers').select('*').eq('user_id', DEVELOPER_ID)

    if (!existingPrayers || existingPrayers.length === 0) {
      await supabase.from('prayers').insert(prayers)
      console.log(`Created ${prayers.length} prayers`)
    }

    // Seed anonymous posts
    const anonymousPosts = [
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '요즘 신앙생활이 너무 건조해요. 어떻게 하면 다시 은혜를 경험할 수 있을까요?',
        pray_count: 5,
        comment_count: 2,
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '가족 중 한 명이 아픈데 함께 기도해주세요.',
        pray_count: 12,
        comment_count: 3,
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        content: '성경을 읽을 때 집중이 잘 안 되는데 좋은 방법이 있을까요?',
        pray_count: 3,
        comment_count: 4,
      },
    ]

    // Insert anonymous posts
    const { data: existingAnonymousPosts } = await supabase.from('anonymous_posts').select('*').eq('user_id', DEVELOPER_ID)

    if (!existingAnonymousPosts || existingAnonymousPosts.length === 0) {
      await supabase.from('anonymous_posts').insert(anonymousPosts)
      console.log(`Created ${anonymousPosts.length} anonymous posts`)
    }

    // Seed public posts
    const publicPosts = [
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '요한복음 3:16 묵상',
        content: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라. 이 말씀이 오늘 저에게 큰 위로가 되었습니다.',
        like_count: 15,
        comment_count: 3,
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '추천 찬양: 주님의 은혜',
        content: '요즘 제가 많이 듣는 찬양인데요, 정말 큰 위로가 됩니다. 함께 들어보세요!',
        like_count: 8,
        comment_count: 2,
      },
      {
        user_id: DEVELOPER_ID, // 개발자 ID로 변경
        title: '교회 청년부 모임 후기',
        content: '오랜만에 청년부 모임에 참석했는데 정말 은혜로웠습니다. 함께 기도하고 말씀 나누는 시간이 소중하다는 걸 다시 한번 느꼈어요.',
        like_count: 12,
        comment_count: 5,
      },
    ]

    // Insert public posts
    const { data: existingPublicPosts } = await supabase.from('public_posts').select('*').eq('user_id', DEVELOPER_ID)

    if (!existingPublicPosts || existingPublicPosts.length === 0) {
      await supabase.from('public_posts').insert(publicPosts)
      console.log(`Created ${publicPosts.length} public posts`)
    }

    console.log('Database seeding completed successfully!')
    return { success: true }
  } catch (error) {
    console.error('Error seeding database:', error)
    return { success: false, error }
  }
}

// Helper function to generate random Bible readings
function getRandomBibleReading() {
  const books = ['창세기', '출애굽기', '레위기', '민수기', '신명기', '마태복음', '마가복음', '누가복음', '요한복음', '사도행전', '로마서', '고린도전서', '고린도후서', '갈라디아서', '에베소서']

  const book = books[Math.floor(Math.random() * books.length)]
  const chapter = Math.floor(Math.random() * 20) + 1
  const verseStart = Math.floor(Math.random() * 20) + 1
  const verseEnd = verseStart + Math.floor(Math.random() * 10) + 1

  return `${book} ${chapter}:${verseStart}-${verseEnd}`
}
