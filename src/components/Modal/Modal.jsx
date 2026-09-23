import React, { useEffect } from 'react';
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children, footer }) {
  // Обработка клавиши Escape для закрытия
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    // Блокировка прокрутки body при открытой модалке
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Если модалка закрыта — не рендерим ничего
  if (!isOpen) return null;

  // Обработчик клика на overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        {/* Шапка модалки */}
        <div className={styles.header}>
          <h2 className={styles.title}>{title || 'Модальное окно'}</h2>
          <button
            className={styles.closeButton}
            onClick={() => onClose?.()}
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Тело модалки */}
        <div className={styles.body}>
          {children}
        </div>

        {/* Футер модалки (опционально) */}
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
