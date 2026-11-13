// Define la URL base de tu backend (cámbiala cuando despliegues el backend a producción)
const API_URL = process.env.NEXT_PUBLIC_API_URL


export const apiService = {
  // 1. Validar clave de acceso del perfil
  async loginProfile(slug: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, password }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error de autenticación');
    }
    return response.json();
  },

  // 2. Obtener todas las notas de un perfil
  async getNotes(slug: string) {
    const response = await fetch(`${API_URL}/notes/${slug}`);
    if (!response.ok) throw new Error('Error al cargar las notas');
    return response.json();
  },

  // 3. Crear una nueva nota (con código admin)
  async createNote(slug: string, content: string, adminCode: string) {
    const response = await fetch(`${API_URL}/notes/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, admin_code: adminCode }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al crear la nota');
    }
    return response.json();
  },

  // 4. Agregar un comentario a una nota específica (múltiples comentarios)
  async addComment(noteId: number, text: string, author: string = 'Familiar') {
    const response = await fetch(`${API_URL}/notes/${noteId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, author }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al agregar el comentario');
    }
    return response.json();
  }
};