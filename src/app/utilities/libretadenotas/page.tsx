import NoteList from '@/components/libretaDeNotas/NoteList';

export const metadata = {
  title: 'Vista de Canción',
  description: 'Detalles de la canción seleccionada',
};

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthPlaceholder from "@/components/AuthPlaceholder";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div className="min-h-screen p-4 flex items-center justify-center"><AuthPlaceholder message="Debes loguearte para usar la Libreta de Notas." /></div>;
  }

  // Al ser un Server Component, simplemente renderiza el componente cliente
  // El componente cliente se encargará de acceder a localStorage
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <NoteList />
    </div>
  );
}
