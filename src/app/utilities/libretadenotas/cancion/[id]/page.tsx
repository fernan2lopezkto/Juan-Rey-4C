import VistaCancion from '@components/libretadenotas/VistaCancion';

// En Next.js 13+ params es un objeto
export default function Page({ params }: { params: { id: string } }) {
  return <VistaCancion id={params.id} />;
}
