const TIER_CONFIG = {
  BRONZE:   { color: '#CD7F32', bg: 'rgba(205,127,50,0.12)',  icon: '🥉', label: 'Bronze'   },
  SILVER:   { color: '#A8A9AD', bg: 'rgba(168,169,173,0.12)', icon: '🥈', label: 'Silver'   },
  GOLD:     { color: '#FFD700', bg: 'rgba(255,215,0,0.12)',   icon: '🥇', label: 'Gold'     },
  PLATINUM: { color: '#E5E4E2', bg: 'rgba(229,228,226,0.12)', icon: '💎', label: 'Platinum' },
};

export default function TrustBadge({ tier = 'BRONZE', size = 'md', showLabel = true }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;

  const sizes = {
    sm: { badge: 'px-2 py-0.5 text-xs gap-1', icon: 'text-sm' },
    md: { badge: 'px-3 py-1 text-sm gap-1.5',  icon: 'text-base' },
    lg: { badge: 'px-4 py-2 text-base gap-2',  icon: 'text-xl' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <span
      className={`inline-flex items-center rounded-full font-display font-semibold ${s.badge}`}
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}40` }}
    >
      <span className={s.icon}>{cfg.icon}</span>
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}
