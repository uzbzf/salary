import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';

// Ленивый импорт App с fallback-заглушкой на случай, если файл ещё не создан
const App = React.lazy(() =>
  import('./App.jsx').catch(() => ({
    default: () => (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Salary Tracker</h1>
        <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>
          Глобальные стили применены. App.jsx будет создан на следующем этапе.
        </p>
      </div>
    ),
  }))
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <React.Suspense fallback={<div style={{ padding: '2rem' }}>Загрузка...</div>}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);
