import { useRef, useEffect, useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';
import { Spinner } from '../Spinner/Spinner';
import { SEARCH_MODES, API_LIMITS } from '../../../utils/constants';
import { getIngredientEmoji } from '../../../utils/recipeUtils';

export function SearchBar({
  query,
  onQueryChange,
  mode,
  onModeChange,
  onSubmit,
  loading = false,
  suggestions = [],
  placeholder: placeholderProp,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const isIngredientMode = mode === SEARCH_MODES.INGREDIENT;

  const filteredSuggestions =
    isIngredientMode && query.length >= 2
      ? suggestions
          .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
          .slice(0, API_LIMITS.AUTOCOMPLETE_LIMIT)
      : [];

  const showDropdown = open && filteredSuggestions.length > 0;

  useEffect(() => {
    function handleOutsideClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      setOpen(false);
      onSubmit?.(query.trim());
    }
  }

  function handleSuggestionClick(suggestion) {
    onQueryChange(suggestion);
    setOpen(false);
    onSubmit?.(suggestion);
  }

  const placeholder =
    placeholderProp ??
    (isIngredientMode ? 'Ex.: chicken, garlic, pasta...' : 'Buscar frango cremoso...');

  return (
    <div className="search-bar" ref={wrapperRef}>
      <span className="search-bar__icon" aria-hidden="true">
        {loading ? <Spinner /> : <FiSearch size={18} />}
      </span>

      <input
        ref={inputRef}
        type="search"
        className={`search-bar__input${query ? ' search-bar__input--active' : ''}`}
        value={query}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label={isIngredientMode ? 'Buscar por ingrediente' : 'Buscar receita por nome'}
        autoComplete="off"
      />

      <div className="search-bar__modes" role="group" aria-label="Modo de busca">
        <button
          type="button"
          className={`search-bar__mode-btn${mode === SEARCH_MODES.NAME ? ' search-bar__mode-btn--active' : ''}`}
          onClick={() => onModeChange(SEARCH_MODES.NAME)}
          aria-pressed={mode === SEARCH_MODES.NAME}
        >
          Nome
        </button>
        <button
          type="button"
          className={`search-bar__mode-btn${mode === SEARCH_MODES.INGREDIENT ? ' search-bar__mode-btn--active' : ''}`}
          onClick={() => onModeChange(SEARCH_MODES.INGREDIENT)}
          aria-pressed={mode === SEARCH_MODES.INGREDIENT}
        >
          Ingrediente
        </button>
      </div>

      {query && (
        <button
          type="button"
          className="search-bar__clear"
          onClick={() => {
            onQueryChange('');
            setOpen(false);
            inputRef.current?.focus();
          }}
          aria-label="Limpar busca"
        >
          <FiX size={16} />
        </button>
      )}

      {showDropdown && (
        <div className="search-bar__dropdown" role="listbox" aria-label="Sugestões de ingredientes">
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              role="option"
              aria-selected="false"
              className="search-bar__suggestion"
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => e.key === 'Enter' && handleSuggestionClick(suggestion)}
              type="button"
            >
              <span className="search-bar__suggestion-emoji" aria-hidden="true">
                {getIngredientEmoji(suggestion)}
              </span>
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
