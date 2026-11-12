'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import CreateNoteModal from '@/app/fase3/CreateNoteModal'; // Ajusta la ruta si pusiste el componente en otra carpeta
import NoteCard from '@/app/fase3/NoteCard';             // Ajusta la ruta según tu estructura

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

export default function PaginaGeneral() {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  // Formatear el slug para mostrar el nombre limpio (ej: 'mary-luz' -> 'Mary Luz')
  const familyName = slug ? slug.replace(/-/g, ' ') : '';

  // Estados de la página
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Lista de notas simulada (aquí luego conectaremos tu backend)
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      content: 'Bienvenido al muro de notas de este perfil. Aquí podrás registrar información importante.',
      date: '12 de Noviembre, 2026',
      comment: {
        text: '¡Entendido! Todo claro por aquí.',
        date: '12 de Noviembre, 2026'
      }
    }
  ]);

  // 1. Validar la sesión al cargar la página
  useEffect(() => {
    if (slug) {
      const authKey = `auth_${slug.toLowerCase()}`;
      const sessionValid = sessionStorage.getItem(authKey);

      if (!sessionValid) {
        alert('Acceso no autorizado. Debes ingresar la clave desde la rueda de opciones.');
        router.push('/'); // Redirige a la rueda si no está autenticado
      } else {
        setIsAuthorized(true);
      }
    }
  }, [slug, router]);

  // 2. Función para manejar la creación de una nueva nota (con código admin)
  const handleCreateNote = (content: string, adminCode: string): boolean => {
    // Aquí puedes validar el código admin o dejar que el backend lo valide
    const SPECIAL_ADMIN_CODE = '9876'; 
    if (adminCode !== SPECIAL_ADMIN_CODE) return false;

    const newNote: Note = {
      id: Date.now().toString(),
      content,
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      comment: null // Inicia sin comentario para que cualquier familiar pueda dejar su único comentario
    };

    setNotes([newNote, ...notes]);
    return true;
  };

  // 3. Función para agregar el comentario único a una nota específica
  const handleAddComment = (noteId: string, commentText: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note => {
        if (note.id === noteId && !note.comment) {
          return {
            ...note,
            comment: {
              text: commentText,
              date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
            }
          };
        }
        return note;
      })
    );
  };

  if (!isAuthorized) {
    return <div style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>Verificando acceso...</div>;
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

      {/* Botón de Creación de Notas (Protegido por código admin) */}
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
        {notes.length === 0 ? (
          <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No hay notas registradas todavía.</p>
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

      {/* Modal para crear notas (Pide código admin + redacción) */}
      <CreateNoteModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitNote={handleCreateNote}
      />
    </div>
  );
}