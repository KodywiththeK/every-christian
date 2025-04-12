"use client"

import { Home, BookOpen, Users, User, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function MainNavigation() {
  const pathname = usePathname()

  const navItems = [
    { icon: <Home className="h-6 w-6" />, label: "홈", href: "/home" },
    { icon: <BookOpen className="h-6 w-6" />, label: "성경", href: "/bible" },
    { icon: <Users className="h-6 w-6" />, label: "커뮤니티", href: "/community" },
    { icon: <Trophy className="h-6 w-6" />, label: "챌린지", href: "/challenges" },
    { icon: <User className="h-6 w-6" />, label: "내정보", href: "/profile" },
  ]

  return (
    <div className="bg-white border-t border-gray-200 py-2">
      <div className="container max-w-md mx-auto">
        <nav className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center px-4 py-2 ${
                  isActive ? "text-[#1A365D]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

// 확장 고려:
// 1. 알림 표시 기능
// 2. 활성 메뉴 표시 개선
// 3. 접근성 향상 (aria-current 등)

