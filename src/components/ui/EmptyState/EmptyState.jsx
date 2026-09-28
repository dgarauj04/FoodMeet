import './EmptyState.css';
import { Button } from '../Button/Button';

export function EmptyState({ emoji = '🍳', title, message, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-state__emoji" role="img" aria-hidden="true">{emoji}</span>
      <h2 className="empty-state__title">{title}</h2>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <div className="empty-state__action">
          <Button variant="primary" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
