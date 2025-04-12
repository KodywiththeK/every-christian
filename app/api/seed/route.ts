import { NextResponse } from 'next/server'
import { seedDatabase } from '@/lib/seed-data'

export async function GET() {
  try {
    const result = await seedDatabase()

    if (result.success) {
      return NextResponse.json({ message: 'Database seeded successfully!' }, { status: 200 })
    } else {
      return NextResponse.json({ message: 'Error seeding database', error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in seed route:', error)
    return NextResponse.json({ message: 'Error seeding database', error }, { status: 500 })
  }
}

// 인증 없이 접근 가능하도록 설정
export const dynamic = 'force-dynamic'
