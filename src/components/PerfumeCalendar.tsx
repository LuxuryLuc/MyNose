import { useState } from 'react'
import { DailyPerfume, PerfumePost } from '../types'
import './PerfumeCalendar.css'

interface PerfumeCalendarProps {
  dailyRecords: DailyPerfume[]
  onAddRecord: (record: DailyPerfume) => void
  onRemoveRecord: (date: string) => void
  posts: PerfumePost[]
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

const formatDate = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const formatPostDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}

const PerfumeCalendar = ({ dailyRecords, onAddRecord, onRemoveRecord, posts }: PerfumeCalendarProps) => {
  const today = new Date()
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customImage, setCustomImage] = useState('')
  const [inputMode, setInputMode] = useState<'select' | 'custom'>('select')
  const [showDetail, setShowDetail] = useState(false)

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const goToToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth())
  }

  const handleDayClick = (day: number) => {
    const dateStr = formatDate(currentYear, currentMonth, day)
    setSelectedDate(dateStr)
    setCustomName('')
    setCustomImage('')
    setInputMode('select')
    setShowDetail(false)
    setIsRecordModalOpen(true)
  }

  const handleSelectPerfume = (post: PerfumePost) => {
    if (!selectedDate) return
    onAddRecord({
      date: selectedDate,
      perfumeName: post.name,
      perfumeImage: post.perfumeImage,
      postId: post.id
    })
    setShowDetail(true)
  }

  const handleCustomSubmit = () => {
    if (!selectedDate || !customName.trim()) return
    onAddRecord({
      date: selectedDate,
      perfumeName: customName.trim(),
      perfumeImage: customImage || ''
    })
    setCustomName('')
    setCustomImage('')
    setShowDetail(true)
  }

  const handleRemoveRecord = (date: string) => {
    onRemoveRecord(date)
    setShowDetail(false)
  }

  const getRecordForDate = (dateStr: string) => {
    return dailyRecords.find(r => r.date === dateStr)
  }

  const getPostById = (postId: string) => {
    return posts.find(p => p.id === postId)
  }

  const isToday = (day: number) => {
    return (
      currentYear === today.getFullYear() &&
      currentMonth === today.getMonth() &&
      day === today.getDate()
    )
  }

  const calendarDays: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d)
  }

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]

  const selectedRecord = selectedDate ? getRecordForDate(selectedDate) : null
  const linkedPost = selectedRecord?.postId ? getPostById(selectedRecord.postId) : null

  return (
    <div className="perfume-calendar">
      <div className="calendar-header">
        <button className="calendar-nav-btn" onClick={prevMonth}>‹</button>
        <div className="calendar-title">
          <span className="calendar-month">{currentYear}年 {monthNames[currentMonth]}</span>
          <button className="calendar-today-btn" onClick={goToToday}>今天</button>
        </div>
        <button className="calendar-nav-btn" onClick={nextMonth}>›</button>
      </div>

      <div className="calendar-weekdays">
        {WEEKDAYS.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty" />
          }
          const dateStr = formatDate(currentYear, currentMonth, day)
          const record = getRecordForDate(dateStr)
          const todayClass = isToday(day) ? 'today' : ''
          const hasRecordClass = record ? 'has-record' : ''

          return (
            <div
              key={day}
              className={`calendar-day ${todayClass} ${hasRecordClass}`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{day}</span>
              {record && (
                <div className="day-perfume">
                  {record.perfumeImage ? (
                    <img src={record.perfumeImage} alt={record.perfumeName} className="day-perfume-img" />
                  ) : (
                    <span className="day-perfume-icon">💧</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {isRecordModalOpen && selectedDate && (
        <>
          <div className="modal-overlay" onClick={() => setIsRecordModalOpen(false)} />
          <div className="record-modal">
            <div className="record-modal-header">
              <button className="modal-close-btn" onClick={() => setIsRecordModalOpen(false)}>×</button>
              <h3>{selectedDate}</h3>
            </div>

            <div className="record-mode-tabs">
              <button
                className={`mode-tab ${inputMode === 'select' ? 'active' : ''}`}
                onClick={() => setInputMode('select')}
              >
                从收藏选择
              </button>
              <button
                className={`mode-tab ${inputMode === 'custom' ? 'active' : ''}`}
                onClick={() => setInputMode('custom')}
              >
                自定义输入
              </button>
            </div>

            {inputMode === 'select' ? (
              <div className="perfume-select-list">
                {posts.length === 0 ? (
                  <div className="empty-perfumes">
                    <p>还没有收藏的香水</p>
                    <p className="empty-hint">去时间流发布你的第一支香水吧</p>
                  </div>
                ) : (
                  posts.map(post => (
                    <div
                      key={post.id}
                      className={`perfume-select-item ${selectedRecord?.postId === post.id ? 'current' : ''}`}
                      onClick={() => handleSelectPerfume(post)}
                    >
                      <img src={post.perfumeImage} alt={post.name} className="perfume-select-img" />
                      <div className="perfume-select-info">
                        <span className="perfume-select-name">{post.name}</span>
                        <span className="perfume-select-family">{post.fragranceFamily.join(' · ')}</span>
                      </div>
                      {selectedRecord?.postId === post.id && (
                        <span className="select-check">✓</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="custom-input-section">
                <div className="form-group">
                  <label>香水名称 *</label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="输入香水名称"
                  />
                </div>
                <div className="form-group">
                  <label>照片（可选）</label>
                  <div className="custom-image-area">
                    {customImage ? (
                      <div className="image-preview">
                        <img src={customImage} alt="预览" />
                        <button type="button" className="remove-image-btn" onClick={() => setCustomImage('')}>×</button>
                      </div>
                    ) : (
                      <div
                        className="upload-placeholder small"
                        onClick={() => {
                          const input = document.createElement('input')
                          input.type = 'file'
                          input.accept = 'image/*'
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0]
                            if (!file) return
                            const reader = new FileReader()
                            reader.onloadend = () => setCustomImage(reader.result as string)
                            reader.readAsDataURL(file)
                          }
                          input.click()
                        }}
                      >
                        <span>📷 点击上传</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="custom-submit-btn"
                  onClick={handleCustomSubmit}
                  disabled={!customName.trim()}
                >
                  记录
                </button>
              </div>
            )}

            {showDetail && selectedRecord && (
              <div className="record-detail-section">
                <div className="record-detail-divider"></div>
                {linkedPost ? (
                  <div className="record-post-detail">
                    <div className="record-post-header">
                      <div className="record-post-top">
                        <div className="avatar">🌸</div>
                        <span className="record-post-time">{formatPostDate(linkedPost.createdAt)}</span>
                      </div>
                      <button className="remove-record-btn" onClick={() => handleRemoveRecord(selectedDate)}>
                        移除记录
                      </button>
                    </div>
                    <div className="record-post-image">
                      <img src={linkedPost.perfumeImage} alt={linkedPost.name} />
                    </div>
                    <div className="record-post-body">
                      <h2 className="record-post-name">{linkedPost.name}</h2>
                      <div className="record-post-meta">
                        <span className="meta-item">
                          <span className="meta-label">香型</span>
                          <div className="meta-tags">
                            {linkedPost.fragranceFamily.map(f => (
                              <span key={f} className="meta-tag">{f}</span>
                            ))}
                          </div>
                        </span>
                        {linkedPost.perfumer && (
                          <span className="meta-item">
                            <span className="meta-label">调香师</span>
                            <span className="meta-value">{linkedPost.perfumer}</span>
                          </span>
                        )}
                      </div>
                      {linkedPost.scentNotes.length > 0 && (
                        <div className="record-post-notes">
                          <h4>香调笔记</h4>
                          <div className="record-notes-grid">
                            {linkedPost.scentNotes.map((note, idx) => (
                              <div key={idx} className="record-note-item">
                                <img src={note.image} alt={note.name} />
                                <span>{note.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="current-record-simple">
                    <div className="current-record-info">
                      {selectedRecord.perfumeImage && (
                        <img src={selectedRecord.perfumeImage} alt={selectedRecord.perfumeName} className="current-record-img" />
                      )}
                      <span className="current-record-name">{selectedRecord.perfumeName}</span>
                    </div>
                    <button className="remove-record-btn" onClick={() => handleRemoveRecord(selectedDate)}>
                      移除记录
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default PerfumeCalendar
