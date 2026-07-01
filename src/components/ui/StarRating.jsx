export default function StarRating({ score = 0, max = 5, size = 'sm' }) {
  const filled = Math.round(score);
  const sz = size === 'lg' ? 'text-xl' : 'text-sm';
  return (
    <span className={`inline-flex gap-0.5 ${sz}`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} style={{ color: i < filled ? '#FFD700' : '#ffffff20' }}>★</span>
      ))}
      <span className="ml-1 text-white/50 font-mono text-xs">{score.toFixed(1)}</span>
    </span>
  );
}
