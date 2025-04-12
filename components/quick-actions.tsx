import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, MessageCircle, PenSquare } from "lucide-react"
import Link from "next/link"

export default function QuickActions() {
  const actions = [
    {
      icon: <PenSquare className="h-5 w-5" />,
      label: "감사일기 쓰기",
      href: "/gratitude",
      color: "bg-amber-100 text-amber-700",
    },
    {
      icon: <BookOpen className="h-5 w-5" />,
      label: "성경 읽기",
      href: "/bible",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: <MessageCircle className="h-5 w-5" />,
      label: "커뮤니티",
      href: "/community",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "성경 플래너",
      href: "/planner",
      color: "bg-purple-100 text-purple-700",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link key={action.label} href={action.href}>
          <Button
            variant="outline"
            className="w-full h-20 flex flex-col items-center justify-center gap-2 border-gray-200 hover:bg-gray-50"
          >
            <div className={`p-2 rounded-full ${action.color}`}>{action.icon}</div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </Button>
        </Link>
      ))}
    </div>
  )
}

