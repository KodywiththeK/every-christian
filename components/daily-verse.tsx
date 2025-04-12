import { Card, CardContent } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import Image from "next/image"

export default function DailyVerse() {
  return (
    <Card className="overflow-hidden border-none shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src="/placeholder.svg?height=400&width=600"
          alt="Morning verse background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-4">
          <p className="text-white text-lg font-medium">"두려워하지 말라 내가 너와 함께 함이라"</p>
          <p className="text-white/80 text-sm mt-1">이사야 41:10</p>

          <button className="absolute top-3 right-3 bg-white/20 p-2 rounded-full">
            <Share2 className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
      <CardContent className="p-4 bg-white">
        <p className="text-sm text-gray-600">
          오늘 하루도 하나님이 함께하심을 기억하세요. 어떤 상황에서도 두려워하지 마세요.
        </p>
      </CardContent>
    </Card>
  )
}

