import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, PenSquare } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function PublicBoard() {
  const posts = [
    {
      id: 1,
      author: "믿음이",
      title: "요한복음 3:16 묵상",
      content:
        "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라. 이 말씀이 오늘 저에게 큰 위로가 되었습니다.",
      likeCount: 15,
      commentCount: 3,
      time: "1시간 전",
    },
    {
      id: 2,
      author: "소망이",
      title: "추천 찬양: 주님의 은혜",
      content: "요즘 제가 많이 듣는 찬양인데요, 정말 큰 위로가 됩니다. 함께 들어보세요!",
      likeCount: 8,
      commentCount: 2,
      time: "3시간 전",
    },
    {
      id: 3,
      author: "사랑이",
      title: "교회 청년부 모임 후기",
      content:
        "오랜만에 청년부 모임에 참석했는데 정말 은혜로웠습니다. 함께 기도하고 말씀 나누는 시간이 소중하다는 걸 다시 한번 느꼈어요.",
      likeCount: 12,
      commentCount: 5,
      time: "어제",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <Button size="sm" variant="default" className="bg-[#1A365D]">
            최신순
          </Button>
          <Button size="sm" variant="outline">
            인기순
          </Button>
        </div>

        <Link href="/community/public/new">
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            <PenSquare className="h-4 w-4" />
            <span>글쓰기</span>
          </Button>
        </Link>
      </div>

      {posts.map((post) => (
        <Card key={post.id} className="border-gray-200">
          <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">{post.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-800">{post.author}</p>
              <p className="text-xs text-gray-500">{post.time}</p>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-2">
            <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
            <p className="text-gray-700 text-sm">{post.content}</p>
          </CardContent>

          <CardFooter className="px-4 py-3 border-t border-gray-100 flex justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50 px-2 py-1 h-auto"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likeCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-gray-600 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 h-auto"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

