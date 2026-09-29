import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiClock, FiHeart } from 'react-icons/fi';
import { FaBasketShopping } from "react-icons/fa6";
import './HomePage.css';
import { useRandomRecipe, useCategories, useFeaturedRecipes } from '../../hooks/useRecipes';
import { useFavorites } from '../../hooks/useFavorites';
import { useCompare } from '../../hooks/useCompare';
import { RecipeCard } from '../../components/Layout/RecipeCard/RecipeCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard/SkeletonCard';
import { EmptyState } from '../../components/ui/EmptyState/EmptyState';
import { Button } from '../../components/ui/Button/Button';
import { Badge } from '../../components/ui/Badge/Badge';
import { ROUTES, recipePath } from '../../utils/constants';

function getRecipeBlurb(recipe) {
  const text = (recipe.instructions || '').replace(/\s+/g, ' ').trim();
  if (!text) {
    const count = recipe.ingredients?.length ?? 0;
    return count
      ? `${count} ingredientes frescos para uma receita ${recipe.category?.toLowerCase() || 'deliciosa'}.`
      : 'Uma receita especial selecionada para você hoje.';
  }

  const sentence = text.split(/(?<=[.!?])\s+/)[0] || text;
  return sentence.length > 140 ? `${sentence.slice(0, 137)}…` : sentence;
}

function estimatePrepMinutes(recipe) {
  const ingredients = recipe.ingredients?.length ?? 6;
  const steps = recipe.steps?.length ?? 4;
  const raw = 12 + ingredients * 2 + steps * 3;
  return Math.min(90, Math.max(15, Math.round(raw / 5) * 5));
}

export function HomePage() {
  const navigate = useNavigate();
  const { data: randomRecipe, loading: randomLoading } = useRandomRecipe();
  const { data: categories, loading: catLoading, usedFallback } = useCategories();
  const { data: featured, loading: featuredLoading } = useFeaturedRecipes();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const categoriesRailRef = useRef(null);
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false);
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(false);

  function updateCategoriesScrollState() {
    const rail = categoriesRailRef.current;
    if (!rail) return;
    setCanScrollCategoriesLeft(rail.scrollLeft > 1);
    setCanScrollCategoriesRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }

  useEffect(() => {
    updateCategoriesScrollState();
    const rail = categoriesRailRef.current;
    if (!rail) return undefined;
    const observer = new ResizeObserver(updateCategoriesScrollState);
    observer.observe(rail);
    return () => observer.disconnect();
  }, [categories, catLoading]);

  function scrollCategories(direction) {
    categoriesRailRef.current?.scrollBy({ left: direction * 260, behavior: 'smooth' });
  }

  function handleToggleFavorite(recipe) {
    toggleFavorite(recipe);
  }

  function handleCompare(recipe) {
    if (isInCompare(recipe.id)) {
      removeFromCompare(recipe.id);
    } else {
      addToCompare(recipe);
    }
  }

  const featuredCount = featured?.length ?? 0;
  const heroFavorite = randomRecipe ? isFavorite(randomRecipe.id) : false;

  return (
    <div>
      <section className="home__hero">
        <div className="container home__hero-inner">
          <div className="home__hero-top">
            <div className="home__hero-text">
              <h1>O que cozinhamos hoje? 👋</h1>
              <p>
                {featuredCount > 0
                  ? `${featuredCount} receitas fresquinhas esperando por você`
                  : 'Descubra, compare e cozinhe com o que você tem.'}
              </p>
            </div>
            <div className="home__hero-status" aria-live="polite">
              <span className="home__hero-status-dot" aria-hidden="true" />
              Atualizado agora mesmo
            </div>
          </div>

          {randomLoading ? (
            <div className="home__hero-skeleton" aria-hidden="true">
              <div className="home__hero-skeleton-img skeleton" />
              <div className="home__hero-skeleton-body">
                <div className="home__hero-skeleton-badges">
                  <div className="skeleton" />
                  <div className="skeleton" />
                </div>
                <div className="home__hero-skeleton-title skeleton" />
                <div className="home__hero-skeleton-sub skeleton" />
                <div className="home__hero-skeleton-sub skeleton" />
                <div className="home__hero-skeleton-btn skeleton" />
              </div>
            </div>
          ) : randomRecipe ? (
            <article className="home__hero-card">
              {randomRecipe.image ? (
                <img
                  src={randomRecipe.image}
                  alt={`Foto de ${randomRecipe.name}`}
                  className="home__hero-card-image"
                  loading="eager"
                />
              ) : (
                <div className="home__hero-card-placeholder" aria-hidden="true">🍽️</div>
              )}

              <div className="home__hero-card-body">
                <div className="home__hero-card-badges">
                  <Badge emoji="✨" label="Receita da semana" tone="success" />
                  {randomRecipe.category && <Badge emoji="🏷️" label={randomRecipe.category} />}
                  {randomRecipe.area && <Badge emoji="🌏" label={randomRecipe.area} />}
                </div>

                <h2 className="home__hero-card-title">{randomRecipe.name}</h2>
                <p className="home__hero-card-desc">{getRecipeBlurb(randomRecipe)}</p>

                <div className="home__hero-card-actions">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate(recipePath(randomRecipe.id))}
                  >
                    Ver receita
                  </Button>

                  <button
                    type="button"
                    className={`home__hero-favorite${heroFavorite ? ' home__hero-favorite--active' : ''}`}
                    onClick={() => handleToggleFavorite(randomRecipe)}
                    aria-label={
                      heroFavorite
                        ? `Remover ${randomRecipe.name} dos favoritos`
                        : `Favoritar ${randomRecipe.name}`
                    }
                  >
                    <FiHeart size={18} fill={heroFavorite ? 'currentColor' : 'none'} />
                    {heroFavorite ? 'Favorito' : 'Favoritar'}
                  </button>

                  <div className="home__hero-card-meta">
                    <span>
                      <FiClock size={15} aria-hidden="true" />
                      {estimatePrepMinutes(randomRecipe)} min
                    </span>
                    <span>
                      <FaBasketShopping size={15} aria-hidden="true" />
                      {randomRecipe.ingredients?.length ?? 0} ingredientes
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ) : null}
        </div>
      </section>

      <section className="home__section">
        <div className="container">
          <h2 className="home__section-title">🍽️ Explore por sabor</h2>
          <div className="home__categories-rail-wrap">
            {canScrollCategoriesLeft && (
              <button type="button" className="home__rail-scroll home__rail-scroll--left" onClick={() => scrollCategories(-1)} aria-label="Ver categorias anteriores">
                <FiChevronLeft size={20} />
              </button>
            )}
          {catLoading ? (
            <div ref={categoriesRailRef} className="home__categories-rail rail" onScroll={updateCategoriesScrollState}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                >
                  <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: '60px', height: '12px', borderRadius: '6px' }} />
                </div>
              ))}
            </div>
          ) : (
            <div ref={categoriesRailRef} className="home__categories-rail rail" onScroll={updateCategoriesScrollState}>
              {categories.map((cat) => (
                <button
                  key={cat.id ?? cat.name}
                  className="home__category-card"
                  onClick={() => navigate(`${ROUTES.RESULTS}?category=${encodeURIComponent(cat.nameEn ?? cat.name)}`)}
                  aria-label={`Ver receitas de ${cat.name}`}
                >
                  <div className="home__category-image-wrapper">
                    {usedFallback || !cat.image ? (
                      <span role="img" aria-hidden="true">{cat.emoji ?? '🍽️'}</span>
                    ) : (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="home__category-image"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span className="home__category-name">{cat.name}</span>
                </button>
              ))}
            </div>
          )}
            {canScrollCategoriesRight && (
              <button type="button" className="home__rail-scroll home__rail-scroll--right" onClick={() => scrollCategories(1)} aria-label="Ver mais categorias">
                <FiChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="home__section">
        <div className="container">
          <h2 className="home__section-title">🔥 Receitas em destaque</h2>

          {featuredLoading ? (
            <div className="home__grid">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : featured.length === 0 ? (
            <EmptyState
              emoji="😕"
              title="Nada por aqui ainda..."
              message="Não conseguimos carregar os destaques. Tente recarregar a página!"
            />
          ) : (
            <div className="home__grid">
              {featured.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCompare={handleCompare}
                  inCompare={isInCompare(recipe.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
