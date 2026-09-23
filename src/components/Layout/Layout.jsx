import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import styles from './Layout.module.css';

function Layout() {
  return (
    <div className={styles.layout}>
      {/* Шапка с навигацией */}
      <Header />
      
      {/* Основной контент — сюда рендерятся страницы */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
