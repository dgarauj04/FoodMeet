import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import './FilterChips.css';

export function FilterChips({ options = [], selected = [], onToggle, label, formatLabel }) {
  const railRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 1);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }

  useEffect(() => {
    updateScrollState();
    const rail = railRef.current;
    if (!rail) return undefined;
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [options]);

  function scrollRail(direction) {
    railRef.current?.scrollBy({ left: direction * 180, behavior: 'smooth' });
  }

  return (
    <div className="filter-chips" role="group" aria-label={label ?? 'Filtros'}>
      {label && <span className="filter-chips__label">{label}</span>}
      <div className="filter-chips__rail-wrap">
        {canScrollLeft && (
          <button type="button" className="filter-chips__scroll filter-chips__scroll--left" onClick={() => scrollRail(-1)} aria-label="Ver filtros anteriores">
            <FiChevronLeft size={18} />
          </button>
        )}
        <div ref={railRef} className="filter-chips__rail rail" onScroll={updateScrollState}>
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                className={`filter-chips__chip${isSelected ? ' filter-chips__chip--selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onToggle(option)}
              >
                {formatLabel ? formatLabel(option) : option}
                {isSelected && (
                  <span className="filter-chips__chip-remove" aria-hidden="true">
                    <FiX size={12} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {canScrollRight && (
          <button type="button" className="filter-chips__scroll filter-chips__scroll--right" onClick={() => scrollRail(1)} aria-label="Ver mais filtros">
            <FiChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}