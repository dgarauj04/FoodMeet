import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FiHome, FiCompass, FiHeart, FiX } from 'react-icons/fi';
import { FaScaleBalanced } from 'react-icons/fa6';
import './Sidebar.css';
import { ROUTES } from '../../../utils/constants';
import { useFavorites } from '../../../hooks/useFavorites';
import { useCompare } from '../../../hooks/useCompare';
import logoFoodmeet from '../../../assets/logo-foodmeet.png';

const NAV_ITEMS = [
  { to: ROUTES.HOME, label: 'Início', icon: FiHome, end: true },
  { to: ROUTES.RESULTS, label: 'Explorar', icon: FiCompass },
  { to: ROUTES.FAVORITES, label: 'Favoritos', icon: FiHeart, badge: 'favorites' },
  { to: ROUTES.COMPARE, label: 'Comparar', icon: FaScaleBalanced, badge: 'compare' },
];

export function Sidebar({ open = false, onClose }) {
  const { favoritesCount } = useFavorites();
  const { compareCount } = useCompare();

  const badges = {
    favorites: favoritesCount,
    compare: compareCount,
  };

  useEffect(() => {
    if (!open) return undefined;

    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose?.();
    }

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  function getLinkClass({ isActive }) {
    return `sidebar__link${isActive ? ' sidebar__link--active' : ''}`;
  }

  return (
    <>
      <button
        type="button"
        className={`sidebar__overlay${open ? ' sidebar__overlay--open' : ''}`}
        onClick={onClose}
        aria-label="Fechar menu"
        tabIndex={open ? 0 : -1}
      />

      <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-label="Navegação principal">
        <div className="sidebar__brand">
          <NavLink to={ROUTES.HOME} className="sidebar__logo" onClick={onClose}>
            <img src={logoFoodmeet} className="sidebar__logo-img" alt="FoodMeet Logo" />
          </NavLink>
          <button
            type="button"
            className="sidebar__close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end, badge }) => {
            const count = badge ? badges[badge] : 0;
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={getLinkClass}
                onClick={onClose}
              >
                <Icon size={18} />
                <span className="sidebar__link-label">{label}</span>
                {count > 0 && <span className="sidebar__badge">{count}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
