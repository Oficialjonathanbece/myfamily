'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase2/password/PasswordModal.css';
import { useRouter } from 'next/navigation';

interface PasswordModalProps {
  isOpen: boolean;
  itemName: string;
  onClose: () => void;
  onSubmitPassword: (password: string) => Promise<boolean>; // 👈 Espera la función asíncrona
}

export default function PasswordModal({ isOpen, onClose, itemName, onSubmitPassword }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      // Validar credenciales contra el backend en FastAPI
      const success = await onSubmitPassword(password);

      if (!success) {
        setErrorMsg('Clave incorrecta.');
        setPassword('');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Clave incorrecta.');
      setPassword('');
    } finally {
      setIsLoading(false);
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="password-modal__input"
          />

          {errorMsg && <span className="password-modal__error">{errorMsg}</span>}

          <div className="password-modal__actions">
            <button
              type="button"
              onClick={() => {
                setPassword('');
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