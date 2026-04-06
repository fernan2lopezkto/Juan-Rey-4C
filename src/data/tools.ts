export interface Tool {
  title: string;
  description: string;
  image: string;
  href: string;
  badge: string;
}

export const TOOLS: Tool[] = [
  {
    title: "YouTube Filter",
    description: "Protege lo que ves. Filtra contenido por palabras clave.",
    image: "/ytfimagens/capturaFilter1.jpg",
    href: "/utilities/youtube-filter",
    badge: "Familiar"
  },
  {
    title: "BibleQuiz",
    description: "Pon a prueba tus conocimientos de las Escrituras con retos interactivos. Una forma divertida de aprender sobre la Biblia.",
    image: "/thumbnails/bible_quiz.png",
    href: "/utilities/bible-quiz",
    badge: "Juego"
  },
  {
    title: "Libreta de canciones",
    description: "Tu repertorio personal siempre a mano. Organiza canciones, progresiones y notas musicales de forma rápida y sencilla.",
    image: "/thumbnails/chords_notebook.png",
    href: "/utilities/libretadenotas",
    badge: "Música"
  }
];
