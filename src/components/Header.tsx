import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <div className="header-logo-svg">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="g6" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0abfc" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path
                d="M100 40 C100 40, 70 80, 70 110 C70 130, 82 148, 88 155 C92 159, 96 161, 100 161 C104 161, 108 159, 112 155 C118 148, 130 130, 130 110 C130 80, 100 40, 100 40Z"
                fill="none"
                stroke="url(#g6)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M88 155 C85 158, 82 160, 80 160"
                fill="none"
                stroke="url(#g6)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M112 155 C115 158, 118 160, 120 160"
                fill="none"
                stroke="url(#g6)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="100" cy="40" r="3" fill="url(#g6)" />
              <line x1="55" y1="170" x2="145" y2="170" stroke="url(#g6)" strokeWidth="0.5" opacity="0.4" />
              <text x="100" y="188" textAnchor="middle" fontFamily="'Helvetica Neue', sans-serif" fontSize="14" fill="url(#g6)" fontWeight="300" letterSpacing="6">MYNOSE</text>
            </svg>
          </div>
          <div className="header-logo-text">
            <h1>My Nose</h1>
            <p className="subtitle">记录你的香水故事</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
