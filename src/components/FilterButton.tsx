import Link from 'next/link';

export default function FilterButton() {
    return (
        <div className=" justify-center text-center my-12">
            <h3 className="text-2xl text-primary font-semibold my-4">
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
            <Link href="/youtube-filter" className="btn btn-primary my-4 btn-lg">
                Ir a Filtro de YouTube
            </Link>
        </div>
    );
}
