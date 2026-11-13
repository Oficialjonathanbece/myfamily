'use client';

import { useState, type FormEvent } from 'react';
import '@/styles/fase3/NoteCard.css';

interface Comment {
  id: number;
  text: string;
  author: string;
  created_at: string;
}

interface Note {
  id: number;
  content: string;
  created_at: string;
  comments: Comment[];
}

interface NoteCardProps {
  note: Note;
  onAddComment: (noteId: number, text: string, author: string) => void;
}

export default function NoteCard({ note, onAddComment }: NoteCardProps) {
  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    onAddComment(note.id, commentText.trim(), authorName.trim() || 'Familiar');
    setCommentText('');
    setAuthorName('');
    setIsSubmitting(false);
  };

  // Formatear fecha legible
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="note-card">
      {/* Cabecera de la nota (Fecha o ID) */}
      <div className="note-card__header">
        <span>Nota ID: #{note.id}</span>
        <span>{formatDate(note.created_at)}</span>
      </div>

      {/* Cuerpo de la nota redactada */}
      <div className="note-card__content">
        {note.content}
      </div>

      {/* Sección del Comentario */}
      <div className="note-card__comment-section">
        <span className="note-card__comment-title">Comentario de la nota:</span>

        {note.comments.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: '#777', fontStyle: 'italic' }}>No hay comentarios aún. ¡Sé el primero en comentar!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {note.comments.map(c => (
              <div key={c.id} className="note-card__comment-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>{c.author}</span>
                  <span>{formatDate(c.created_at)}</span>
                </div>
                <p style={{ margin: 0 }}>{c.text}</p>
              </div>
            ))}
          </div>
        )}
          
          <form onSubmit={handleSubmitComment} className="note-card__comment-form">
            <textarea
              placeholder="Escribe un comentario para esta nota..."
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="note-card__comment-input"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="note-card__btn-comment"
            >
             {isSubmitting ? 'Enviando...' : 'Comentar'}
            </button>
          </form>
      </div>
    </div>
  );
}