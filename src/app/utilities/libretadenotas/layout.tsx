// utilities/libretadenotas/layout.tsx
import MenuFlotante from '@components/libretadenotas/MenuFlotante';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-base-100 pb-24"> 
      {/* pb-24 da espacio para que el contenido no quede tapado por el botón flotante */}
      
      <main className="container mx-auto p-4 pt-8">
        {children}
      </main>

      <MenuFlotante />
    </div>
  );
}
