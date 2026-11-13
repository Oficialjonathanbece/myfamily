'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CreateNoteModal from '@/app/fase3/CreateNoteModal'; // 👈 Verifica que esta ruta sea la tuya
import NoteCard from '@/app/fase3/NoteCard';             // 👈 Verifica que esta ruta sea la tuya
import { apiService } from '@/services/api';

interface Comment {
  id: number;
  text: string;
  author: string;
  created_at: string;
}

interface Note {
  id: number;
  profile_slug: string;
  content: string;
  created_at: string;
  comments: Comment[];
}

function ContenidoPaginaGeneral() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const familyName = slug ? slug.replace(/-/g, ' ') : '';

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [notes, setNotes] = useState<Note[]>([]);
    
  // 1. Validar la sesión al cargar la página
  useEffect(() => {
    if (slug) {
      const authKey = `auth_${slug.toLowerCase()}`;
      const sessionValid = sessionStorage.getItem(authKey);

      if (!sessionValid) {
        alert('Acceso no autorizado. Debes ingresar la clave desde la rueda de opciones.');
        router.push('/');
      } else {
        setIsAuthorized(true);
        fetchNotes(slug);
      }
    }
  }, [slug, router]);

  const fetchNotes = async (profileSlug: string) => {
    try {
      const data = await apiService.getNotes(profileSlug);
      setNotes(data);
    } catch (error) {
      console.error('Error al obtener notas:', error);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  
  // 2. Crear nota conectada al backend
  const handleCreateNote = async (content: string, adminCode: string): Promise<boolean> => {
    try {
      const newNote = await apiService.createNote(slug, content, adminCode);
      setNotes(prev => [newNote, ...prev]);
      return true;
    } catch (error: any) {
      alert(error.message || 'Error al crear la nota');
      return false;
    }
  };

  // 3. Agregar comentario conectado al backend
  const handleAddComment = async (noteId: number, text: string, author: string) => {
    try {
      const newComment = await apiService.addComment(noteId, text, author);
      
      // Actualizar estado local agregando el comentario a su respectiva nota
      setNotes(prevNotes =>
        prevNotes.map(note => {
          if (note.id === noteId) {
            return {
              ...note,
              comments: [...note.comments, newComment]
            };
          }
          return note;
        })
      );
    } catch (error: any) {
      alert(error.message || 'Error al enviar el comentario');
    }
  };

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Verificando acceso...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      padding: '2rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Cabecera del Perfil */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '1rem'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>Perfil Protegido</span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{familyName}</h1>
        </div>
        
        <button
          onClick={() => router.push('/')}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#a6a6a6',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          Volver a la rueda
        </button>
      </div>

      {/* Botón de Creación de Notas */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            background: '#fff',
            color: '#000',
            border: 'none',
            padding: '0.75rem 1.25rem',
            borderRadius: '0.5rem',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(255,255,255,0.15)'
          }}
        >
          + Crear Nueva Nota
        </button>
      </div>

      {/* Muro de Notas */}
      <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isLoadingNotes ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Cargando notas del servidor...</p>
        ) : notes.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No hay notas registradas todavía en este perfil.</p>
        ) : (
          notes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onAddComment={handleAddComment}
            />
          ))
        )}
      </div>

      {/* Modal para crear notas */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitNote={handleCreateNote}
      />
    </div>
  );
}

// Componente principal envuelto en Suspense para que Next.js 16 compile sin errores
export default function PaginaGeneral() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        Cargando perfil...
      </div>
    }>
      <ContenidoPaginaGeneral />
    </Suspense>
  );
}