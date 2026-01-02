// utilities/libretadenotas/page.tsx
//import NoteApp from '@/components/libretaDeNotas/NoteApp';
import PrincipalFooter from "@/components/PrincipalFooter";

export const metadata = {
  title: 'Libreta de Acordes | Juan Rey',
  description: 'Utilidad para guardar progresiones de acordes',
};

export default function LibretaPage() {
  return (
    <section className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Libreta de Acordes</h1>
        <p className="text-base-content/70">
          Guarda tus progresiones y composiciones localmente.
        </p>
      </div>

      {/* Aquí cargamos la lógica cliente */}

      <PrincipalFooter />
    </section>
  );
}
