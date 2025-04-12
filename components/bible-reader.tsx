import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookMarked, ChevronLeft, ChevronRight, Highlighter, MessageSquare } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function BibleReader() {
  return (
    <div>
      <div className="flex gap-3 mb-4">
        <Select defaultValue="john">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="성경 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="genesis">창세기</SelectItem>
            <SelectItem value="exodus">출애굽기</SelectItem>
            <SelectItem value="matthew">마태복음</SelectItem>
            <SelectItem value="mark">마가복음</SelectItem>
            <SelectItem value="luke">누가복음</SelectItem>
            <SelectItem value="john">요한복음</SelectItem>
            <SelectItem value="romans">로마서</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="3">
          <SelectTrigger className="w-24">
            <SelectValue placeholder="장" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1장</SelectItem>
            <SelectItem value="2">2장</SelectItem>
            <SelectItem value="3">3장</SelectItem>
            <SelectItem value="4">4장</SelectItem>
            <SelectItem value="5">5장</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-gray-200 mb-4">
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">요한복음 3장</h2>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <BookMarked className="h-5 w-5 text-gray-500" />
            </Button>
          </div>

          <div className="space-y-4 text-gray-800">
            <p>
              <span className="font-medium text-primary">16</span> 하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니
              이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.
            </p>
            <p>
              <span className="font-medium text-primary">17</span> 하나님이 그 아들을 세상에 보내신 것은 세상을 심판하려
              하심이 아니요 그로 말미암아 세상이 구원을 받게 하려 하심이라.
            </p>
            <p>
              <span className="font-medium text-primary">18</span> 그를 믿는 자는 심판을 받지 아니하는 것이요 믿지
              아니하는 자는 하나님의 독생자의 이름을 믿지 아니하므로 벌써 심판을 받은 것이니라.
            </p>
          </div>

          <div className="flex justify-between mt-6">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>이전</span>
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Highlighter className="h-4 w-4 text-yellow-500" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MessageSquare className="h-4 w-4 text-blue-500" />
              </Button>
            </div>

            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>다음</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

