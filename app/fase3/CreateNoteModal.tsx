'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase3/CreateNoteModal.css';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Cambiamos a que retorne una Promesa o booleano de forma asíncrona para validar contra el servidor
  onSubmitNote: (content: string, adminCode: string) => Promise<boolean> | boolean;
}

export default function CreateNoteModal({ isOpen, onClose, onSubmitNote }: CreateNoteModalProps) {
  const [step, setStep] = useState<'verify' | 'write'>('verify');
  const [adminCode, setAdminCode] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // Paso 1: Solo guardamos el código temporalmente en memoria y pasamos a la pantalla de redactar
  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    if (!adminCode.trim()) {
      setErrorMsg('Introduce el código de administración.');
      return;
    }
    // Pasamos a la redacción; el código real se enviará junto con la nota al backend
    setStep('write');
    setErrorMsg('');
  };

  // Paso 2: Al guardar, enviamos la nota y el código admin al backend mediante la función superior
  const handleSaveNote = async (e: FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      setErrorMsg('La nota no puede estar vacía.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const success = await onSubmitNote(noteContent.trim(), adminCode);
      if (success) {
        // Reiniciamos estados y cerramos
        setStep('verify');
        setAdminCode('');
        setNoteContent('');
        setErrorMsg('');
        onClose();
      } else {
        setErrorMsg('Código de administración incorrecto o error al guardar.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Hubo un error al guardar la nota.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setStep('verify');
    setAdminCode('');
    setNoteContent('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="note-modal__overlay">
      <div className="note-modal__card">
        {step === 'verify' ? (
          <>
            <h3 className="note-modal__title">Acceso de Creación</h3>
            <p className="note-modal__subtitle">
              Introduce el código especial de administración para redactar una nueva nota.
            </p>

            <form onSubmit={handleVerifyCode} className="note-modal__form">
              <input
                type="password"
                placeholder="Código especial"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                autoFocus
                className="note-modal__input"
                style={{ textAlign: 'center', letterSpacing: '2px' }}
              />

              {errorMsg && <span className="note-modal__error">{errorMsg}</span>}

              <div className="note-modal__actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="note-modal__btn-cancel"
                >
                  Cancelar
                </button>
                <button type="submit" className="note-modal__btn-submit">
                  Continuar
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className="note-modal__title">Redactar Nueva Nota</h3>
            <p className="note-modal__subtitle">
              Escribe el contenido que quedará registrado en este perfil.
            </p>

            <form onSubmit={handleSaveNote} className="note-modal__form">
              <textarea
                placeholder="Escribe tu nota aquí..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                autoFocus
                className="note-modal__textarea"
                disabled={isLoading}
              />

              {errorMsg && <span className="note-modal__error">{errorMsg}</span>}

              <div className="note-modal__actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="note-modal__btn-cancel"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button type="submit" className="note-modal__btn-submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Nota'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}