import './Badge.css';

export function Badge({ emoji, label, tone = 'default' }) {
  return (
    <span className={`badge badge--${tone}`}>
      {emoji && <span aria-hidden="true">{emoji}</span>}
      {label}
    </span>
  );
}
