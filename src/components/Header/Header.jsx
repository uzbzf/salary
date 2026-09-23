import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Header.module.css';

// Конфигурация пунктов навигации
const NAV_ITEMS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/history', label: 'История', end: false },
  { to: '/analytics', label: 'Аналитика', end: false },
];

function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип — ссылка на главную */}
        <Link to="/" className={styles.logo}>
          💰 Salary Tracker
        </Link>

        {/* Навигация */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
