import { useState, useRef, useEffect, useCallback } from 'react'
import { PerfumePost, PerfumeStatus } from '../types'
import PostForm from './PostForm'
import './CreatePost.css'

interface CreatePostProps {
  onAddPost: (post: PerfumePost) => void
}

const CreatePost = ({ onAddPost }: CreatePostProps) => {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false)
  const [menuAnimState, setMenuAnimState] = useState<'closed' | 'entering' | 'open' | 'leaving'>('closed')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [postStatus, setPostStatus] = useState<PerfumeStatus>('owned')
  const typeMenuRef = useRef<HTMLDivElement>(null)
  const animTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const closeMenu = useCallback(() => {
    setMenuAnimState('leaving')
    animTimerRef.current = setTimeout(() => {
      setIsTypeMenuOpen(false)
      setMenuAnimState('closed')
    }, 150)
  }, [])

  const toggleMenu = useCallback(() => {
    if (isTypeMenuOpen || menuAnimState === 'leaving') {
      closeMenu()
    } else {
      setIsTypeMenuOpen(true)
      setMenuAnimState('entering')
      animTimerRef.current = setTimeout(() => setMenuAnimState('open'), 200)
    }
  }, [isTypeMenuOpen, menuAnimState, closeMenu])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (typeMenuRef.current && !typeMenuRef.current.contains(e.target as Node)) {
        if (isTypeMenuOpen) closeMenu()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (animTimerRef.current) clearTimeout(animTimerRef.current)
    }
  }, [isTypeMenuOpen, closeMenu])

  const handleSelectType = (status: PerfumeStatus) => {
    setPostStatus(status)
    closeMenu()
    setTimeout(() => setIsModalOpen(true), 160)
  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const handleSubmit = (post: PerfumePost) => {
    onAddPost(post)
  }

  const isOpen = isTypeMenuOpen || menuAnimState === 'leaving'

  return (
    <>
      <div ref={typeMenuRef}>
        <button
          className={`floating-button${isOpen ? ' open' : ''}`}
          onClick={toggleMenu}
          aria-label="添加香水"
        >
          +
        </button>

        {isOpen && (
          <div className={`type-menu${menuAnimState === 'entering' ? ' entering' : ''}${menuAnimState === 'leaving' ? ' leaving' : ''}`}>
            <button className="type-menu-item owned" onClick={() => handleSelectType('owned')}>
              <span className="type-menu-icon">✅</span>
              <div className="type-menu-text">
                <span className="type-menu-label">已拥有</span>
                <span className="type-menu-desc">记录你拥有的香水</span>
              </div>
            </button>
            <button className="type-menu-item wanted" onClick={() => handleSelectType('wanted')}>
              <span className="type-menu-icon">💫</span>
              <div className="type-menu-text">
                <span className="type-menu-label">想要</span>
                <span className="type-menu-desc">添加到心愿清单</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <PostForm
          defaultStatus={postStatus}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}
    </>
  )
}

export default CreatePost
