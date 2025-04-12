"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { ChallengeForm } from "@/features/challenge/components/ChallengeForm"
import { useRouter } from "next/navigation"

export default function NewChallengePage() {
  const router = useRouter()

  const handleCancel = () => {
    router.push("/challenges")
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container max-w-md mx-auto px-4 flex items-center">
          <Link href="/challenges">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold text-[#1A365D]">새 챌린지 만들기</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <ChallengeForm onCancel={handleCancel} />
      </main>
    </div>
  )
}

