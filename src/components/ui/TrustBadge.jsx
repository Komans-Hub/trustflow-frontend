const TIER_CONFIG = {
  BRONZE:   { color: '#92400e', bg: '#fef3c7', border: '#f59e0b', label: 'Bronze',   icon: '🥉' },
  SILVER:   { color: '#374151', bg: '#f3f4f6', border: '#9ca3af', label: 'Silver',   icon: '🥈' },
  GOLD:     { color: '#78350f', bg: '#fffbeb', border: '#f59e0b', label: 'Gold',     icon: '🥇' },
  PLATINUM: { color: '#1e3a5f', bg: '#eff6ff', border: '#3b82f6', label: 'Platinum', icon: '💎' },
};

export default function TrustBadge({ tier = 'BRONZE', size = 'md', showLabel = true }) {
  const cfg = TIER_CONFIG[tier] || TIER_CONFIG.BRONZE;
  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };
  return (
    <span className={`inline-flex items-center rounded-pill font-body font-semibold ${sizes[size] || sizes.md}`}
          style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <span>{cfg.icon}</span>
      {showLabel && <span>{cfg.label}</span>}
    </span>
  );
}
