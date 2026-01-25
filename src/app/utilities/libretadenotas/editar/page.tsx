import NoteForm from '@/components/libretaDeNotas/NoteForm';

export const metadata = {
  title: 'Editar Canción',
};

export default function EditarPage() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col justify-center">
      {/* Pasamos mode='edit', el componente buscará el ID en localStorage */}
      <NoteForm mode="edit" />
    </div>
  );
}
