// utilities/libretadenotas/layout.tsx
import MenuFlotante from '@/components/libretaDeNotas/MenuFlotante';
import LdnFooter from "@/components/libretaDeNotas/LdnFooter";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return (
  <div>
    <div className="relative min-h-screen bg-base-100 pb-8"> 
      <main className="container mx-auto p-4 pt-8">
        {children}
      </main>

      <MenuFlotante />
    </div>
    <LdnFooter />
  </div>
  );
}
