'use client';

import { useState } from 'react'; // O la ruta correspondiente de tu importación
import Opciones from '@/app/fase2/opciones';
import { useRouter } from 'next/navigation';


export default function BlogPage() {
  return (
    <div style={{ 
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    padding: '4rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center' }}>
  
     {/* Contenedor de opciones con desvanecimiento aplicado */}
      <div className="opcionesContainer"> 
        <Opciones/>
      </div>
</div>
);
}
