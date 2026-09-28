import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/Layout/Header/Header';
import { Sidebar } from './components/Layout/Sidebar/Sidebar';
import { Footer } from './components/Layout/Footer/Footer';
import { CompareTray } from './components/Layout/CompareTray/CompareTray';
import { HomePage } from './pages/HomePage/HomePage';
import { ResultsPage } from './pages/ResultsPage/ResultsPage';
import { RecipeDetails } from './pages/RecipeDetailsPage/RecipeDetails';
import { FavoritesPage } from './pages/FavoritesPage/FavoritesPage';
import { ComparePage } from './pages/ComparePage/ComparePage';
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
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.RESULTS} element={<ResultsPage />} />
            <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetails />} />
            <Route path={ROUTES.FAVORITES} element={<FavoritesPage />} />
            <Route path={ROUTES.COMPARE} element={<ComparePage />} />
            <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <CompareTray />
    </div>
  );
}
