import { useNavigate } from 'react-router-dom';
import './NotFound.css';
import { Button } from '../../components/ui/Button/Button';
import { ROUTES } from '../../utils/constants';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found">
      <div className="container not-found__inner">
        <span className="not-found__emoji" role="img" aria-label="Confuso">🥴</span>
        <p className="not-found__code">404 receitas não encontradas</p>
        <h1 className="not-found__title">Essa receita saiu do cardápio!</h1>
        <p className="not-found__message">
          Parece que essa página foi pro forno e não voltou. Mas a cozinha continua aberta! 🍳
        </p>
        <Button variant="primary" size="lg" onClick={() => navigate(ROUTES.HOME)}>
          Voltar para a cozinha
        </Button>
      </div>
    </div>
  );
}
