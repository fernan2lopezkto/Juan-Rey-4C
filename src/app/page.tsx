import PrincipalHero from "@/components/PrincipalHero";
import PrincipalFooter from "@/components/PrincipalFooter";
import Link from "next/link";
import Image from "next/image";

const TOOLS = [
  {
    title: "Filtro de YouTube",
    description: "Protege lo que ven los más pequeños. Filtra contenido por palabras clave y mejora el algoritmo oficial marcando automáticamente como 'No me gusta'.",
    image: "/ytfimagens/capturaFilter1.jpg",
    href: "/youtube",
    badge: "Familiar"
  },
  {
    title: "Quiz Bíblico",
    description: "Pon a prueba tus conocimientos de las Escrituras con retos interactivos. Una forma divertida de aprender sobre la Biblia en familia.",
    image: "/thumbnails/bible_quiz.png",
    href: "/utilities/biblequiz",
    badge: "Juego"
  },
  {
    title: "Libreta de Acordes",
    description: "Tu repertorio personal siempre a mano. Organiza canciones, progresiones y notas musicales de forma rápida y sencilla.",
    image: "/thumbnails/chords_notebook.png",
    href: "/utilities/libretadenotas",
    badge: "Música"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <PrincipalHero />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool, index) => (
            <div 
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 group"
            >
              <figure className="relative h-48 overflow-hidden">
                <img 
                  src={tool.image} 
                  alt={tool.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <div className="badge badge-primary font-bold shadow-lg">{tool.badge}</div>
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
                  {tool.title}
                </h2>
                <p className="text-base-content/70 leading-relaxed">
                  {tool.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={tool.href} 
                    className="btn btn-primary btn-md group-hover:shadow-lg transition-all"
                  >
                    Entrar ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="divider opacity-10"></div>
      <PrincipalFooter />
    </div>
  );
}
