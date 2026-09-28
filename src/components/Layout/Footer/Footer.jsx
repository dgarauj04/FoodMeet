// src/components/Layout/Footer.jsx

import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__text">Feito com 🧡 para quem ama cozinhar</p>
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
      </div>
    </footer>
  );
}
