export default function Student({ isJumping, isDead }) {
  return (
    <div
      className={`sprite-student ${!isJumping && !isDead ? 'running' : ''}`}
      style={{ filter: isDead ? 'grayscale(1) brightness(0.5)' : 'none' }}
    >
      <svg
        width="32" height="48"
        viewBox="0 0 16 24"
        style={{ imageRendering: 'pixelated', display: 'block' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <rect x="4" y="0" width="8" height="7" rx="1" fill="#FBBF72" />
        {/* Hair */}
        <rect x="4" y="0" width="8" height="2" rx="1" fill="#1a0a00" />
        <rect x="4" y="0" width="2" height="4" fill="#1a0a00" />
        {/* Eyes */}
        <rect x="6" y="3" width="1" height="1" fill={isDead ? '#ef4444' : '#1a0a00'} />
        <rect x="9" y="3" width="1" height="1" fill={isDead ? '#ef4444' : '#1a0a00'} />
        {/* Mouth */}
        <rect x="6" y="5" width="4" height="1" fill={isDead ? '#ef4444' : '#92400e'} />
        {/* Body - hoodie */}
        <rect x="3" y="7" width="10" height="8" rx="1" fill="#3b82f6" />
        {/* Hoodie pocket */}
        <rect x="5" y="12" width="6" height="3" rx="1" fill="#2563eb" />
        {/* Backpack */}
        <rect x="11" y="8" width="3" height="6" rx="1" fill="#f59e0b" />
        <rect x="12" y="9" width="1" height="4" fill="#d97706" />
        {/* Arms */}
        <g className="arm-left" style={{ transformOrigin: '4px 8px' }}>
          <rect x="1" y="7" width="2" height="6" rx="1" fill="#3b82f6" />
          <rect x="1" y="13" width="2" height="2" rx="1" fill="#FBBF72" />
        </g>
        <g className="arm-right" style={{ transformOrigin: '12px 8px' }}>
          <rect x="11" y="7" width="2" height="6" rx="1" fill="#3b82f6" />
        </g>
        {/* Legs */}
        <g className="leg-left" style={{ transformOrigin: '6px 15px' }}>
          <rect x="4" y="15" width="3" height="6" rx="1" fill="#1e293b" />
          <rect x="3" y="20" width="4" height="2" rx="1" fill="#1a1a2e" />
        </g>
        <g className="leg-right" style={{ transformOrigin: '10px 15px' }}>
          <rect x="9" y="15" width="3" height="6" rx="1" fill="#1e293b" />
          <rect x="9" y="20" width="4" height="2" rx="1" fill="#1a1a2e" />
        </g>
      </svg>
    </div>
  );
}
