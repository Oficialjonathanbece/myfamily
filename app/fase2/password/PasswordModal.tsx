'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase2/password/PasswordModal.css';

interface PasswordModalProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onSubmitPassword: (password: string) => boolean; // Devuelve true si la clave es correcta
}

export default function PasswordModal({ isOpen, itemName, onClose, onSubmitPassword }: PasswordModalProps) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const success = onSubmitPassword(passwordInput);
    if (!success) {
      setErrorMsg('Clave incorrecta. Inténtalo de nuevo.');
      setPasswordInput('');
    }
  };

  return (
    <div className="password-modal__overlay">
      <div className="password-modal__card">
        <h3 className="password-modal__title">
          Acceso para: <span className="password-modal__name">{itemName}</span>
        </h3>
        <p className="password-modal__subtitle">
          Introduce la clave secreta para ver la información.
        </p>

        <form onSubmit={handleSubmit} className="password-modal__form">
          <input
            type="password"
            placeholder="Clave"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            autoFocus
            className="password-modal__input"
          />

          {errorMsg && <span className="password-modal__error">{errorMsg}</span>}

          <div className="password-modal__actions">
            <button
              type="button"
              onClick={() => {
                setPasswordInput('');
                setErrorMsg('');
                onClose();
              }}
              className="password-modal__btn-cancel"
            >
              Cancelar
            </button>
            <button type="submit" className="password-modal__btn-submit">
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}