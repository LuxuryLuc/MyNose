import { useState, useRef, useEffect } from 'react'
import { PerfumePost, PerfumeStatus, ScentNote, FRAGRANCE_FAMILIES } from '../types'
import './PostForm.css'

interface PostFormProps {
  initialData?: PerfumePost
  defaultStatus?: PerfumeStatus
  onSubmit: (post: PerfumePost) => void
  onClose: () => void
}

const PostForm = ({ initialData, defaultStatus, onSubmit, onClose }: PostFormProps) => {
  const isEdit = !!initialData

  const [perfumeImage, setPerfumeImage] = useState(initialData?.perfumeImage || '')
  const [name, setName] = useState(initialData?.name || '')
  const [brand, setBrand] = useState(initialData?.brand || '')
  const [fragranceFamily, setFragranceFamily] = useState<string[]>(initialData?.fragranceFamily || [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [perfumer, setPerfumer] = useState(initialData?.perfumer || '')
  const [scentNotes, setScentNotes] = useState<ScentNote[]>(
    initialData?.scentNotes?.length ? initialData.scentNotes : [{ name: '', image: '' }]
  )
  const [postStatus, setPostStatus] = useState<PerfumeStatus>(
    initialData?.status || defaultStatus || 'owned'
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggleFamily = (family: string) => {
    setFragranceFamily(prev =>
      prev.includes(family)
        ? prev.filter(f => f !== family)
        : [...prev, family]
    )
  }

  const handleRemoveFamily = (family: string) => {
    setFragranceFamily(prev => prev.filter(f => f !== family))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setPerfumeImage(reader.result as string)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleRemoveImage = () => {
    setPerfumeImage('')
  }

  const handleAddScentNote = () => {
    setScentNotes([...scentNotes, { name: '', image: '' }])
  }

  const handleRemoveScentNote = (index: number) => {
    if (scentNotes.length > 1) {
      setScentNotes(scentNotes.filter((_, i) => i !== index))
    }
  }

  const handleScentNoteChange = (index: number, field: 'name' | 'image', value: string) => {
    const updated = [...scentNotes]
    updated[index][field] = value
    setScentNotes(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const post: PerfumePost = {
      id: initialData?.id || Date.now().toString(),
      perfumeImage: perfumeImage || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=perfume%20bottle%20placeholder&image_size=square_hd',
      name,
      brand,
      fragranceFamily,
      perfumer,
      scentNotes: scentNotes.filter(note => note.name).map(note => ({
        name: note.name,
        image: note.image || `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(note.name)}&image_size=square`
      })),
      createdAt: initialData?.createdAt || new Date(),
      status: postStatus
    }
    onSubmit(post)
    onClose()
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="create-post-modal">
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose}>
            ×
          </button>
          <h2>
            {isEdit
              ? (postStatus === 'owned' ? '✅ 编辑已拥有的香水' : '💫 编辑想要的香水')
              : (postStatus === 'owned' ? '✅ 添加已拥有的香水' : '💫 添加想要的香水')
            }
          </h2>
        </div>

        <div className="status-toggle">
          <button
            type="button"
            className={`status-toggle-btn owned ${postStatus === 'owned' ? 'active' : ''}`}
            onClick={() => setPostStatus('owned')}
          >
            ✅ 已拥有
          </button>
          <button
            type="button"
            className={`status-toggle-btn wanted ${postStatus === 'wanted' ? 'active' : ''}`}
            onClick={() => setPostStatus('wanted')}
          >
            💫 想要
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>香水照片</label>
            {perfumeImage ? (
              <div className="image-preview">
                <img src={perfumeImage} alt="预览" />
                <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                  ×
                </button>
              </div>
            ) : (
              <div className="image-upload-area">
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span className="upload-text">选择照片上传</span>
                </div>
                <div className="upload-buttons">
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📁 上传照片
                  </button>
                  <button
                    type="button"
                    className="upload-btn camera-btn"
                    onClick={() => cameraInputRef.current?.click()}
                  >
                    📸 拍摄照片
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>香水名称 *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：香奈儿5号"
              required
            />
          </div>

          <div className="form-group">
            <label>品牌</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="例如：Chanel"
            />
          </div>

          <div className="form-row">
            <div className="form-group" ref={dropdownRef}>
              <label>香型 *</label>
              <div
                className={`family-dropdown-trigger ${isDropdownOpen ? 'active' : ''}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {fragranceFamily.length > 0 ? (
                  <div className="family-tags">
                    {fragranceFamily.map(f => (
                      <span key={f} className="family-tag">
                        {f}
                        <span
                          className="family-tag-remove"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFamily(f)
                          }}
                        >
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="family-placeholder">选择香型</span>
                )}
                <span className="dropdown-arrow">{isDropdownOpen ? '▲' : '▼'}</span>
              </div>
              {isDropdownOpen && (
                <div className="family-dropdown-menu">
                  {FRAGRANCE_FAMILIES.map(family => (
                    <label key={family} className="family-option">
                      <input
                        type="checkbox"
                        checked={fragranceFamily.includes(family)}
                        onChange={() => handleToggleFamily(family)}
                      />
                      <span className="family-checkbox-custom"></span>
                      <span className="family-option-text">{family}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>调香师</label>
              <input
                type="text"
                value={perfumer}
                onChange={(e) => setPerfumer(e.target.value)}
                placeholder="例如：Ernest Beaux"
              />
            </div>
          </div>

          <div className="scent-notes-section">
            <div className="section-header">
              <label>香调笔记 *</label>
              <button type="button" onClick={handleAddScentNote} className="add-note-btn">
                + 添加香调
              </button>
            </div>
            {scentNotes.map((note, index) => (
              <div key={index} className="scent-note-input">
                <input
                  type="text"
                  value={note.name}
                  onChange={(e) => handleScentNoteChange(index, 'name', e.target.value)}
                  placeholder="香调名称"
                  required
                />
                <input
                  type="text"
                  value={note.image}
                  onChange={(e) => handleScentNoteChange(index, 'image', e.target.value)}
                  placeholder="图片URL（可选）"
                />
                {scentNotes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveScentNote(index)}
                    className="remove-note-btn"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              取消
            </button>
            <button type="submit" className="submit-btn" disabled={fragranceFamily.length === 0}>
              {isEdit ? '保存' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default PostForm
