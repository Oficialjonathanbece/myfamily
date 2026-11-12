'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase3/CreateNoteModal.css';

interface CreateNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitNote: (content: string, adminCode: string) => boolean; // Retorna true si el código admin y la nota son correctos
}

export default function CreateNoteModal({ isOpen, onClose, onSubmitNote }: CreateNoteModalProps) {
  const [step, setStep] = useState<'verify' | 'write'>('verify');
  const [adminCode, setAdminCode] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Código especial predeterminado para crear notas (puedes cambiarlo o moverlo a config)
  const SPECIAL_ADMIN_CODE = '9876';

  const handleVerifyCode = (e: FormEvent) => {
    e.preventDefault();
    if (adminCode === SPECIAL_ADMIN_CODE) {
      setStep('write');
      setErrorMsg('');
    } else {
      setErrorMsg('Código de administración incorrecto.');
      setAdminCode('');
    }
  };

  const handleSaveNote = (e: FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) {
      setErrorMsg('La nota no puede estar vacía.');
      return;
    }

    const success = onSubmitNote(noteContent, adminCode);
    if (success) {
      // Reiniciamos estados y cerramos
      setStep('verify');
      setAdminCode('');
      setNoteContent('');
      setErrorMsg('');
      onClose();
    } else {
      setErrorMsg('Hubo un error al guardar la nota.');
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
                  Verificar
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
                  Guardar Nota
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}