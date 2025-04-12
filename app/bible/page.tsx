import MainNavigation from '@/components/main-navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import BibleReader from '@/components/bible-reader'
import BiblePlanner from '@/components/bible-planner'
import BibleHighlights from '@/components/bible-highlights'

export default function BiblePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background-page">
      <main className="flex-1 container max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-primary mb-6">내 성경</h1>

        <Tabs defaultValue="read" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="read">성경 읽기</TabsTrigger>
            <TabsTrigger value="planner">1독 플래너</TabsTrigger>
            <TabsTrigger value="highlights">하이라이트</TabsTrigger>
          </TabsList>

          <TabsContent value="read">
            <BibleReader />
          </TabsContent>

          <TabsContent value="planner">
            <BiblePlanner />
          </TabsContent>

          <TabsContent value="highlights">
            <BibleHighlights />
          </TabsContent>
        </Tabs>
      </main>

      <MainNavigation />
    </div>
  )
}
