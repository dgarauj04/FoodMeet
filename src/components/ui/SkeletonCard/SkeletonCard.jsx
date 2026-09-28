import './SkeletonCard.css';

export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__image skeleton" />
      <div className="skeleton-card__body">
        <div className="skeleton-card__title skeleton" />
        <div className="skeleton-card__title--short skeleton" />
        <div className="skeleton-card__badge skeleton" />
      </div>
    </div>
  );
}
