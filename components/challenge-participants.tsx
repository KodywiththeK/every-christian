import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Flame } from "lucide-react"

export default function ChallengeParticipants() {
  const participants = [
    { id: 1, name: "믿음이", streak: 35 },
    { id: 2, name: "소망이", streak: 35 },
    { id: 3, name: "사랑이", streak: 34 },
    { id: 4, name: "기쁨이", streak: 33 },
    { id: 5, name: "평화", streak: 31 },
  ]

  return (
    <div className="overflow-x-auto">
      <div className="flex space-x-3 pb-2">
        {participants.slice(0, 5).map((participant) => (
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

        {participants.length > 5 && (
          <div className="flex flex-col items-center justify-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-medium">
              +{participants.length - 5}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

