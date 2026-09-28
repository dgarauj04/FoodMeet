import { FiX } from 'react-icons/fi';
import './FilterChips.css';

export function FilterChips({ options = [], selected = [], onToggle, label }) {
  return (
    <div className="filter-chips" role="group" aria-label={label ?? 'Filtros'}>
      {label && <span className="filter-chips__label">{label}</span>}
      <div className="filter-chips__rail rail">
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
              {option}
              {isSelected && (
                <span className="filter-chips__chip-remove" aria-hidden="true">
                  <FiX size={12} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
