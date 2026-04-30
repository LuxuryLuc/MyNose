import './BottomNav.css'

export type TabType = 'timeline' | 'calendar'

interface BottomNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  return (
    <nav className="bottom-nav">
      <button
        className={`bottom-nav-item ${activeTab === 'timeline' ? 'active' : ''}`}
        onClick={() => onTabChange('timeline')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z" fill="currentColor" />
        </svg>
        <span>时间流</span>
      </button>
      <button
        className={`bottom-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
        onClick={() => onTabChange('calendar')}
      >
        <svg viewBox="0 0 24 24" className="bottom-nav-icon">
          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" fill="currentColor" />
        </svg>
        <span>香水日历</span>
      </button>
    </nav>
  )
}

export default BottomNav
