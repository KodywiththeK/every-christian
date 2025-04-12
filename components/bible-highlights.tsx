import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function BibleHighlights() {
  const highlights = [
    {
      id: 1,
      verse: "요한복음 3:16",
      text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.",
      note: "하나님의 사랑이 얼마나 크신지 보여주는 구절",
      date: "2023.12.15",
    },
    {
      id: 2,
      verse: "시편 23:1",
      text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.",
      note: "어려울 때 의지하는 말씀",
      date: "2024.01.03",
    },
    {
      id: 3,
      verse: "빌립보서 4:13",
      text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.",
      note: "힘들 때 힘이 되는 구절",
      date: "2024.02.20",
    },
  ]

  return (
    <div>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="하이라이트 검색" className="pl-10" />
      </div>

      <div className="space-y-4">
        {highlights.map((highlight) => (
          <Card key={highlight.id} className="border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-[#1A365D]">{highlight.verse}</h3>
                <span className="text-xs text-gray-500">{highlight.date}</span>
              </div>

              <p className="text-gray-800 mb-3 border-l-4 border-yellow-300 pl-3 py-1 bg-yellow-50 text-sm">
                {highlight.text}
              </p>

              {highlight.note && (
                <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                  <span className="font-medium">메모:</span> {highlight.note}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

