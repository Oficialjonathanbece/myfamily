import Background from '@/app/fase1/background';
import './globals.css'; // Tus estilos globales de CSS puro

export const metadata = {
  title: 'Blog Familiar',
  description: 'Historias y momentos de la familia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0, backgroundColor: '#0b0f19', color: '#ffffff', minHeight: '100vh' }}>
        {/* Fondo global de rayos de luz */}
        <Background />

        {/* Contenido de las páginas de tu blog */}
        <main style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </main>
      </body>
    </html>
  );
}