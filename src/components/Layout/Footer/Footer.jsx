import './Footer.css';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">Feito para quem ama cozinhar ou para quem deseja se aventurar na cozinha</p>
        <p className="footer__text">
          Dados por{' '}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            TheMealDB
          </a>{' '}
          · {year}
        </p>
        <nav className="footer__social" aria-label="Redes sociais de Douglas Araujo">
          <a href="https://www.linkedin.com/in/douglasaraujo-daraujodb-dev" target="_blank" rel="noopener noreferrer" className="footer__link footer__social-link">
            <FiLinkedin size={16} aria-hidden="true" /> LinkedIn
          </a>
          <a href="https://github.com/dgarauj04" target="_blank" rel="noopener noreferrer" className="footer__link footer__social-link">
            <FiGithub size={16} aria-hidden="true" /> GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
