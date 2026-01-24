// utilities/libretadenotas/layout.tsx
import MenuFlotante from '@/components/libretaDeNotas/MenuFlotante';
import LdnFooter from "@/components/libretaDeNotas/LdnFooter";
import { SongsProvider } from '@/context/SongsContext';

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
    <SongsProvider>
      <div className="relative min-h-screen bg-base-100 pb-24"> 
        <main className="container mx-auto p-4 pt-8">
          {children}
        </main>

        {/* El menú flotante ahora podrá usar useSongs() para acciones rápidas */}
        <MenuFlotante />
      </div>
      <LdnFooter />
    </SongsProvider>
  );
}
