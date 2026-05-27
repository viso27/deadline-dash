const OBSTACLES = {
  assignment: {
    label: '📄',
    color: '#f8fafc',
    border: '#94a3b8',
    width: 28,
    height: 36,
    render: () => (
      <svg width="28" height="36" viewBox="0 0 14 18" style={{ imageRendering: 'pixelated' }}>
        <rect x="1" y="0" width="12" height="16" rx="1" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" />
        <rect x="3" y="3" width="8" height="1" fill="#cbd5e1" />
        <rect x="3" y="5" width="8" height="1" fill="#cbd5e1" />
        <rect x="3" y="7" width="5" height="1" fill="#cbd5e1" />
        <rect x="3" y="9" width="7" height="1" fill="#ef4444" />
        <rect x="3" y="11" width="6" height="1" fill="#cbd5e1" />
        <text x="7" y="17" textAnchor="middle" fontSize="4" fill="#ef4444" fontFamily="monospace" fontWeight="bold">DUE!</text>
      </svg>
    )
  },
  coffee: {
    label: '☕',
    color: '#92400e',
    width: 24,
    height: 32,
    render: () => (
      <svg width="24" height="32" viewBox="0 0 12 16" style={{ imageRendering: 'pixelated' }}>
        <rect x="2" y="4" width="8" height="10" rx="1" fill="#92400e" />
        <rect x="3" y="5" width="6" height="8" fill="#78350f" />
        <rect x="2" y="2" width="8" height="2" rx="0" fill="#d97706" />
        <rect x="3" y="0" width="1" height="2" fill="#6b7280" />
        <rect x="5" y="0" width="1" height="3" fill="#6b7280" />
        <rect x="7" y="0" width="1" height="2" fill="#6b7280" />
        <rect x="10" y="6" width="2" height="4" rx="1" fill="#92400e" />
        <text x="6" y="11" textAnchor="middle" fontSize="4" fill="#fbbf24" fontFamily="monospace">☕</text>
      </svg>
    )
  },
  wifi: {
    label: '📡',
    color: '#6366f1',
    width: 32,
    height: 40,
    render: () => (
      <svg width="32" height="40" viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
        <rect x="7" y="14" width="2" height="4" fill="#6366f1" />
        <rect x="5" y="16" width="6" height="2" fill="#6366f1" />
        <rect x="3" y="10" width="10" height="2" fill="#6366f1" opacity="0.6" />
        <rect x="1" y="6" width="14" height="2" fill="#6366f1" opacity="0.4" />
        <rect x="0" y="2" width="16" height="2" fill="#6366f1" opacity="0.2" />
        <rect x="7" y="13" width="2" height="2" rx="1" fill="#ef4444" />
        <text x="8" y="20" textAnchor="middle" fontSize="3" fill="#ef4444" fontFamily="monospace">NO WIFI</text>
      </svg>
    )
  },
  prof: {
    label: '👨‍🏫',
    color: '#065f46',
    width: 28,
    height: 48,
    render: () => (
      <svg width="28" height="48" viewBox="0 0 14 24" style={{ imageRendering: 'pixelated' }}>
        <rect x="3" y="0" width="8" height="7" rx="1" fill="#d97706" />
        <rect x="3" y="0" width="8" height="2" fill="#292524" />
        <rect x="6" y="3" width="1" height="1" fill="#292524" />
        <rect x="9" y="3" width="1" height="1" fill="#292524" />
        <rect x="6" y="5" width="4" height="1" fill="#92400e" />
        <rect x="2" y="7" width="10" height="8" rx="1" fill="#065f46" />
        <rect x="10" y="8" width="3" height="5" rx="1" fill="#f1f5f9" />
        <rect x="0" y="7" width="2" height="6" rx="1" fill="#065f46" />
        <rect x="12" y="7" width="2" height="6" rx="1" fill="#065f46" />
        <rect x="3" y="15" width="3" height="7" rx="1" fill="#1c1917" />
        <rect x="2" y="21" width="4" height="2" rx="1" fill="#0c0a09" />
        <rect x="8" y="15" width="3" height="7" rx="1" fill="#1c1917" />
        <rect x="8" y="21" width="4" height="2" rx="1" fill="#0c0a09" />
      </svg>
    )
  }
};

export default function Obstacle({ type, x, groundY }) {
  const obs = OBSTACLES[type] || OBSTACLES.assignment;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        bottom: groundY,
        width: obs.width,
        height: obs.height,
        display: 'flex',
        alignItems: 'flex-end',
      }}
    >
      {obs.render()}
    </div>
  );
}

export { OBSTACLES };
