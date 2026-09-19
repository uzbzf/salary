import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import styles from './App.module.css';

// Ленивый импорт Layout с fallback
const Layout = React.lazy(() =>
  import('./components/Layout/Layout.jsx').catch(() => ({
    default: ({ children }) => (
      <div className={styles.app}>
        <header style={{ padding: '1rem 2rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }}>Salary Tracker</h1>
        </header>
        <main style={{ flex: 1, padding: '2rem' }}>
          {children}
        </main>
      </div>
    ),
  }))
);

// Ленивый импорт страниц с fallback
const Dashboard = React.lazy(() =>
  import('./pages/Dashboard/Dashboard.jsx').catch(() => ({
    default: () => <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Страница «Главная» будет создана позже</div>,
  }))
);

const History = React.lazy(() =>
  import('./pages/History/History.jsx').catch(() => ({
    default: () => <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Страница «История» будет создана позже</div>,
  }))
);

const Analytics = React.lazy(() =>
  import('./pages/Analytics/Analytics.jsx').catch(() => ({
    default: () => <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Страница «Аналитика» будет создана позже</div>,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
