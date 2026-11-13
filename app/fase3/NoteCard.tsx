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

  const handleSubmitComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return; // Si no hay texto, no hace nada

    setIsSubmitting(true);
    try {
      // Llamamos a la función del padre pasándole el texto y el autor
      await onAddComment(
        note.id, 
        commentText.trim(), 
        authorName.trim() || 'Familiar'
      );
      
      // Limpiamos los campos solo si fue exitoso
      setCommentText('');
      setAuthorName('');
    } catch (err) {
      console.error("Error al enviar comentario:", err);
    } finally {
      setIsSubmitting(false);
    }
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
      {/* Cabecera de la nota */}
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
        <span className="note-card__comment-title">Comentarios de la nota:</span>

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
          {/* Input opcional para el nombre del autor */}
          <input
            type="text"
            placeholder="Tu nombre (opcional)..."
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="note-card__author-input"
            style={{ marginBottom: '0.5riem', padding: '0.4rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
          />

          {/* Textarea principal vinculado correctamente a commentText */}
          <textarea
            placeholder="Escribe un comentario para esta nota..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="note-card__comment-input"
            required
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