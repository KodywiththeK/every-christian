import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flame } from "lucide-react"
import type { ChallengeParticipant } from "../types"

interface ChallengeParticipantsListProps {
  participants: ChallengeParticipant[]
  maxDisplay?: number
}

export function ChallengeParticipantsList({ participants, maxDisplay = 5 }: ChallengeParticipantsListProps) {
  const displayParticipants = participants.slice(0, maxDisplay)
  const remainingCount = participants.length - maxDisplay

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-3 pb-2">
        {displayParticipants.map((participant) => (
          <div key={participant.id} className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-blue-100">
                <AvatarFallback className="bg-blue-100 text-blue-600">{participant.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                <Flame className="h-3 w-3" />
              </div>
            </div>
            <span className="text-xs font-medium mt-1">{participant.name}</span>
            <span className="text-xs text-gray-500">{participant.streak}일째</span>
          </div>
        ))}

        {remainingCount > 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
              +{remainingCount}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// 확장 고려:
// 1. 참여자 프로필 클릭 시 상세 정보
// 2. 참여자 검색 기능
// 3. 참여자 정렬 (스트릭, 이름 등)

