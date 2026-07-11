export default function StarRating({ score = 0, max = 5, size = 'sm' }) {
  const filled = Math.round(score);
  const sz = size === 'lg' ? 'text-lg' : 'text-sm';
  return (
    <span className={`inline-flex items-center gap-0.5 ${sz}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < filled ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
      <span className="ml-1 text-ink-soft font-body text-caption-sm">{Number(score).toFixed(1)}</span>
    </span>
  );
}
