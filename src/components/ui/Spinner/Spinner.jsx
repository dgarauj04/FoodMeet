import './Spinner.css';

export function Spinner({ size = 'md' }) {
  return (
    <span
      role="status"
      aria-label="Carregando..."
      className={`spinner${size === 'lg' ? ' spinner--lg' : ''}`}
    />
  );
}
