// src/AppRoutes.jsx

import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header/Header';
import { Sidebar } from './components/Layout/Sidebar/Sidebar';
import { Footer } from './components/Layout/Footer/Footer';
import { CompareTray } from './components/Layout/CompareTray/CompareTray';
import { Home } from './pages/HomePage/Home';
import { Results } from './pages/ResultsPage/Results';
import { RecipeDetails } from './pages/RecipeDetailsPage/RecipeDetails';
import { Favorites } from './pages/FavoritesPage/Favorites';
import { Compare } from './pages/ComparePage/Compare';
import { NotFound } from './pages/NotFound/NotFound';
import { ROUTES } from './utils/constants';

export function AppRoutes() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="app-shell__main">
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main className="page">
          <Routes>
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.RESULTS} element={<Results />} />
            <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetails />} />
            <Route path={ROUTES.FAVORITES} element={<Favorites />} />
            <Route path={ROUTES.COMPARE} element={<Compare />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CompareTray />
    </div>
  );
}
