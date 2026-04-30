import { useState, useRef, useEffect, useMemo } from 'react'
import { PerfumePost, FRAGRANCE_FAMILIES } from '../types'
import PostCard from './PostCard'
import './PostList.css'

interface PostListProps {
  posts: PerfumePost[]
  onUpdatePost: (post: PerfumePost) => void
  onDeletePost: (postId: string) => void
}

const PostList = ({ posts, onUpdatePost, onDeletePost }: PostListProps) => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([])
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false)
  const [familyDropdownOpen, setFamilyDropdownOpen] = useState(false)
  const brandDropdownRef = useRef<HTMLDivElement>(null)
  const familyDropdownRef = useRef<HTMLDivElement>(null)

  const uniqueBrands = useMemo(() => {
    const brands = posts
      .map(p => p.brand)
      .filter((b): b is string => !!b)
    return [...new Set(brands)].sort()
  }, [posts])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(e.target as Node)) {
        setBrandDropdownOpen(false)
      }
      if (familyDropdownRef.current && !familyDropdownRef.current.contains(e.target as Node)) {
        setFamilyDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const toggleFamily = (family: string) => {
    setSelectedFamilies(prev =>
      prev.includes(family) ? prev.filter(f => f !== family) : [...prev, family]
    )
  }

  const removeBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand))
  }

  const removeFamily = (family: string) => {
    setSelectedFamilies(prev => prev.filter(f => f !== family))
  }

  const clearAllFilters = () => {
    setSelectedBrands([])
    setSelectedFamilies([])
  }

  const hasFilters = selectedBrands.length > 0 || selectedFamilies.length > 0

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      if (selectedBrands.length > 0 && !selectedBrands.includes(post.brand)) {
        return false
      }
      if (selectedFamilies.length > 0 && !selectedFamilies.some(f => post.fragranceFamily.includes(f))) {
        return false
      }
      return true
    })
  }, [posts, selectedBrands, selectedFamilies])

  return (
    <div className="post-list-wrapper">
      <div className="filter-bar">
        <div className="filter-dropdowns">
          <div className="filter-dropdown" ref={brandDropdownRef}>
            <button
              className={`filter-trigger ${selectedBrands.length > 0 ? 'active' : ''}`}
              onClick={() => { setBrandDropdownOpen(!brandDropdownOpen); setFamilyDropdownOpen(false) }}
            >
              <span className="filter-trigger-icon">🏷️</span>
              <span>品牌</span>
              {selectedBrands.length > 0 && (
                <span className="filter-count">{selectedBrands.length}</span>
              )}
              <span className="filter-arrow">{brandDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {brandDropdownOpen && (
              <div className="filter-menu brand-menu">
                {uniqueBrands.length === 0 ? (
                  <div className="filter-empty">暂无品牌数据</div>
                ) : (
                  uniqueBrands.map(brand => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="filter-checkbox-custom"></span>
                      <span className="filter-option-text">{brand}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>

          <div className="filter-dropdown" ref={familyDropdownRef}>
            <button
              className={`filter-trigger ${selectedFamilies.length > 0 ? 'active' : ''}`}
              onClick={() => { setFamilyDropdownOpen(!familyDropdownOpen); setBrandDropdownOpen(false) }}
            >
              <span className="filter-trigger-icon">🫧</span>
              <span>香调</span>
              {selectedFamilies.length > 0 && (
                <span className="filter-count">{selectedFamilies.length}</span>
              )}
              <span className="filter-arrow">{familyDropdownOpen ? '▲' : '▼'}</span>
            </button>
            {familyDropdownOpen && (
              <div className="filter-menu family-menu">
                {FRAGRANCE_FAMILIES.map(family => (
                  <label key={family} className="filter-option">
                    <input
                      type="checkbox"
                      checked={selectedFamilies.includes(family)}
                      onChange={() => toggleFamily(family)}
                    />
                    <span className="filter-checkbox-custom"></span>
                    <span className="filter-option-text">{family}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {hasFilters && (
          <button className="filter-clear" onClick={clearAllFilters}>
            清除筛选
          </button>
        )}
      </div>

      {hasFilters && (
        <div className="filter-tags">
          {selectedBrands.map(brand => (
            <span key={brand} className="filter-tag brand-tag">
              {brand}
              <span className="filter-tag-remove" onClick={() => removeBrand(brand)}>×</span>
            </span>
          ))}
          {selectedFamilies.map(family => (
            <span key={family} className="filter-tag family-tag">
              {family}
              <span className="filter-tag-remove" onClick={() => removeFamily(family)}>×</span>
            </span>
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🌸</div>
          <h2>{hasFilters ? '没有匹配的香水' : '还没有香水记录'}</h2>
          <p>{hasFilters ? '试试调整筛选条件' : '点击上方按钮，发布你的第一瓶香水！'}</p>
        </div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} onUpdatePost={onUpdatePost} onDeletePost={onDeletePost} />
          ))}
        </div>
      )}
    </div>
  )
}

export default PostList
