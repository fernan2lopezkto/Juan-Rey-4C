import NoteList from '@/components/libretaDeNotas/NoteList';

export const metadata = {
  title: 'Vista de Canción',
  description: 'Detalles de la canción seleccionada',
};

export default function Page() {
  // Al ser un Server Component, simplemente renderiza el componente cliente
  // El componente cliente se encargará de acceder a localStorage
  return (
    <div className="container mx-auto p-4 min-h-screen">
      <NoteList />
    </div>
  );
}
