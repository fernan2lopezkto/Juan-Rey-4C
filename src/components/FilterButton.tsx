import Link from 'next/link';

export default function FilterButton() {
    return (
        <div className="flex justify-center my-8">
            <Link href="/youtube-filter" className="btn btn-primary btn-lg">
                Ir a Filtro de YouTube
            </Link>
        </div>
    );
}
