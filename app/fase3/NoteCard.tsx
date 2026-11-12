'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase3/NoteCard.css';

interface Comment {
  text: string;
  date: string;
}

interface Note {
  id: string;
  content: string;
  date: string;
  comment?: Comment | null;
}

interface NoteCardProps {
  note: Note;
  onAddComment: (noteId: string, commentText: string) => void;
}

export default function NoteCard({ note, onAddComment }: NoteCardProps) {
  const [commentInput, setCommentInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    onAddComment(note.id, commentInput.trim());
    setCommentInput('');
    setIsSubmitting(false);
  };

  return (
    <div className="note-card">
      {/* Cabecera de la nota (Fecha o ID) */}
      <div className="note-card__header">
        <span>Nota ID: {note.id.slice(0, 6)}</span>
        <span>{note.date}</span>
      </div>

      {/* Cuerpo de la nota redactada */}
      <div className="note-card__content">
        {note.content}
      </div>

      {/* Sección del Comentario Único */}
      <div className="note-card__comment-section">
        <span className="note-card__comment-title">Comentario de la nota:</span>

        {note.comment ? (
          // Si ya existe el comentario único, se muestra fijo
          <div className="note-card__comment-box">
            <p>{note.comment.text}</p>
            <span style={{ fontSize: '0.75rem', color: '#777', display: 'block', marginTop: '0.25rem' }}>
              {note.comment.date}
            </span>
          </div>
        ) : (
          // Si no tiene comentario, se muestra el formulario para dejar el único permitido
          <form onSubmit={handleSubmitComment} className="note-card__comment-form">
            <textarea
              placeholder="Escribe un comentario para esta nota..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              className="note-card__comment-input"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="note-card__btn-comment"
            >
              Comentar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}