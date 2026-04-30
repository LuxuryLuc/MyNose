import { useState } from 'react'
import Header from './components/Header'
import CreatePost from './components/CreatePost'
import PostList from './components/PostList'
import PerfumeCalendar from './components/PerfumeCalendar'
import BottomNav, { TabType } from './components/BottomNav'
import { PerfumePost, DailyPerfume } from './types'

function App() {
  const [posts, setPosts] = useState<PerfumePost[]>([])
  const [dailyRecords, setDailyRecords] = useState<DailyPerfume[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('timeline')

  const handleAddPost = (post: PerfumePost) => {
    setPosts([post, ...posts])
  }

  const handleUpdatePost = (updatedPost: PerfumePost) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const handleAddRecord = (record: DailyPerfume) => {
    setDailyRecords(prev => {
      const filtered = prev.filter(r => r.date !== record.date)
      return [...filtered, record]
    })
  }

  const handleRemoveRecord = (date: string) => {
    setDailyRecords(prev => prev.filter(r => r.date !== date))
  }

  return (
    <div className="app">
      <Header />
      <div className="app-content">
        {activeTab === 'timeline' ? (
          <PostList posts={posts} onUpdatePost={handleUpdatePost} onDeletePost={handleDeletePost} />
        ) : (
          <PerfumeCalendar
            dailyRecords={dailyRecords}
            onAddRecord={handleAddRecord}
            onRemoveRecord={handleRemoveRecord}
            posts={posts}
          />
        )}
      </div>
      {activeTab === 'timeline' && <CreatePost onAddPost={handleAddPost} />}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}

export default App
