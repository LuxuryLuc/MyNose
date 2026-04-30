import { useState } from 'react'
import { PerfumePost } from '../types'
import PostForm from './PostForm'
import './PostCard.css'

interface PostCardProps {
  post: PerfumePost
  onUpdatePost: (post: PerfumePost) => void
  onDeletePost: (postId: string) => void
}

const PostCard = ({ post, onUpdatePost, onDeletePost }: PostCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const formatDate = (date: Date) => {
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

  const handleUpdate = (updatedPost: PerfumePost) => {
    onUpdatePost(updatedPost)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDeletePost(post.id)
    setShowDeleteConfirm(false)
    setShowMenu(false)
  }

  return (
    <>
      <div className="post-card">
        <div className="post-header">
          <div className="avatar">🌸</div>
          <div className="post-info">
            <span className={`status-badge ${post.status}`}>
              {post.status === 'owned' ? '✅ 已拥有' : '💫 想要'}
            </span>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
          <div className="post-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)} title="编辑">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
              </svg>
            </button>
            <button className="more-btn" onClick={() => setShowMenu(!showMenu)} title="更多">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor" />
              </svg>
            </button>
            {showMenu && (
              <div className="post-menu">
                <button className="post-menu-item edit-menu-item" onClick={() => { setIsEditing(true); setShowMenu(false) }}>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                  </svg>
                  <span>编辑</span>
                </button>
                <button className="post-menu-item delete-menu-item" onClick={() => { setShowDeleteConfirm(true); setShowMenu(false) }}>
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor" />
                  </svg>
                  <span>删除</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="perfume-image-container">
          <img src={post.perfumeImage} alt={post.name} className="perfume-image" />
        </div>

        <div className="perfume-details">
          <h2 className="perfume-name">{post.name}</h2>

          {post.brand && (
            <span className="perfume-brand">{post.brand}</span>
          )}

          <div className="perfume-meta">
            <span className="meta-item">
              <span className="meta-label">香型</span>
              <div className="meta-tags">
                {post.fragranceFamily.map(f => (
                  <span key={f} className="meta-tag">{f}</span>
                ))}
              </div>
            </span>
            {post.perfumer && (
              <span className="meta-item">
                <span className="meta-label">调香师</span>
                <span className="meta-value">{post.perfumer}</span>
              </span>
            )}
          </div>

          {post.scentNotes.length > 0 && (
            <div className="scent-notes">
              <h3>香调笔记</h3>
              <div className="scent-notes-grid">
                {post.scentNotes.map((note, index) => (
                  <div key={index} className="scent-note">
                    <img src={note.image} alt={note.name} className="scent-note-image" />
                    <span className="scent-note-name">{note.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <PostForm
          initialData={post}
          onSubmit={handleUpdate}
          onClose={() => setIsEditing(false)}
        />
      )}

      {showDeleteConfirm && (
        <>
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}></div>
          <div className="delete-confirm-modal">
            <div className="delete-confirm-icon">🗑️</div>
            <h3>确认删除</h3>
            <p>确定要删除「{post.name}」吗？此操作无法撤销。</p>
            <div className="delete-confirm-actions">
              <button className="delete-cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                取消
              </button>
              <button className="delete-confirm-btn" onClick={handleDelete}>
                删除
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default PostCard
