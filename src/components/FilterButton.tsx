import Link from 'next/link';

export default function FilterButton() {
    return (
        <div className="flex justify-center my-8">
            <h3 className="text-2xl">
                Youtube kid filter!
            </h3>
            <p className="m-4 italic">
                Aplicación que te permite 
                filtrar el contenido no deseado 
                en Youtube, no solo te oculta los 
                videos que tengan en su titulo o 
                descripción esas palabras que tu 
                quieras evitar, por ejemplo "halloween",
                sino que te las marca como "no me 
                gusta", para que al navegar en la app 
                oficial de Youtube tampoco te 
                aparezcan. Ideal para cuidar lo que 
                ven nuestros hijos.
            </p>
            <Link href="/youtube-filter" className="btn btn-primary btn-lg">
                Ir a Filtro de YouTube
            </Link>
        </div>
    );
}
