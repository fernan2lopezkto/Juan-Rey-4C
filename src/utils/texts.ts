// --- INTERFACES ---

interface NavigationItem {
  label: string;
  href: string;
  submenu?: NavigationItem[];
}

interface HomeTexts {
  hTitle: string;
  hSubtitle: string;
  hparrafos: string[];
  hBotton: string;
  musicosTitle: string;
  musicosSubtitle: string;
  musicosDescription: string[];
  evanTitle: string;
  evanSubtitle: string;
  evanDescription: string[];
  creceTitle: string;
  creceSubtitle: string;
  creceDescription: string[];
}

interface AboutTexts {
  preTitle: string;
  title: string;
  parrafos: string[];
}

// --- CONFIGURACIÓN ---

// NavBars
export const navigationItems: NavigationItem[] = [
  { label: "Inicio", href: "/" },
  {
    label: "Material",
    href: "/material",
    submenu: [
      { label: "Tutoriales", href: "/tutoriales" },
      { label: "Material Evangelístico", href: "/evangelismo" },
      { label: "Contenido Edificante", href: "/edificante" },
    ],
  },
  { label: "Acerca de", href: "/about" },
  { label: "Apóyanos", href: "/support" },
];

// HOME
export const homeTexts: HomeTexts = {
  hTitle: "¡Bienvenidos a",
  hSubtitle: "4C: For Christ!",
  hparrafos: [
    "Lo que inició como un proyecto musical en YouTube, hoy se retoma con una visión expandida. Mi deseo es que 4C: For Christ sea un punto de encuentro y ayuda para que más personas puedan conocer más de Dios y llevar Su mensaje, todo sea para Su gloria. ¡Únete a nuestra comunidad!",
    "Aquí encontrarás recursos prácticos y sencillos, desde aprender a tocar esas canciones que nos ministran tanto de la presencia de Dios, hasta herramientas para compartir el mensaje de Cristo.",
    " ",
  ],
  hBotton: "Descubrir",

  // Cards - Tutoriales
  musicosTitle: "Tutoriales",
  musicosSubtitle: "De Música, Sencillos",
  musicosDescription: [
    "Nuestros tutoriales están pensados para músicos que recién comienzan o desean aprender de forma sencilla.",
    " Encontrarás guías paso a paso para diferentes instrumentos, enfocándonos en canciones cristianas de gran bendición. Queremos que la interpretación sea fácil y accesible, permitiéndote alabar y ministrar la presencia de Dios con tu instrumento. ¡No importa tu nivel, hay algo para ti!",
  ],

  // Cards - Evangelismo
  evanTitle: "Evangelismo",
  evanSubtitle: "Material para Alcanzar a Otros",
  evanDescription: [
    "El llamado a compartir las buenas nuevas es para todos. En esta sección, encontrarás recursos y herramientas prácticas para llevar el mensaje de Jesús a tu entorno.",
    "Aquí te equipamos con ideas, reflexiones y materiales para que puedas iniciar conversaciones, compartir tu testimonio y presentar el evangelio de una manera clara y efectiva. ¡Sé un instrumento en las manos de Dios para alcanzar almas para Cristo!",
  ],

};

// ABOUT
export const aboutTexts: AboutTexts = {
  preTitle: "Hola Mundo!",
  title: "For Christ",
  parrafos: [
    "Soy Juan Rey, Uruguayo, padre de dos hermosos hijos. Fui musico, fotógrafo, emprendedor y varias cosas mas, y hoy a través de esta plataforma, quiero aprovechar mi pasion por el desarrollo de software, para unificar ideas, proyectos y portafolio.",
    "Con 12 añitos comencé a aprender música, mi tío Luis, me regaló un órgano y un cancionero, de esos que venían con todas las notas arriba de la letra y al final dibujos de como hacer los acordes, así comenzó algo que cambio el resto de mi vida. Luego aprendí a tocar la guitarra viendo como tocaban mis compañeros en el grupo, y hace unos cuantos años (cuando necesite tocar bajo, porque era necesario en el grupo de alabanza donde estaba) descubrí cuánto amo ese instrumento de CUATRO CUERDAS lo que dió inicio al canal de YouTube ",

  ],
};

// Secciones vacías con tipos genéricos (puedes definirlos después)
export const materialTexts: Record<string, any> = {};
export const evangelizmoTexts: Record<string, any> = {};
export const tutorialesTexts: Record<string, any> = {};
export const crecimientoTexts: Record<string, any> = {};
export const apoyanosTexts: Record<string, any> = {};
export const tiendaTexts: Record<string, any> = {};

// NOMBRE
export const proyectNames = {
  long: "4C-ForChrist",
  short: "4C"
} as const;

// Footer
export const footerText: string = "© 2025 Mi Plataforma Cristiana. Todos los derechos reservados.";

export const Text: string = "";
