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

  // Cards - Crecimiento
  creceTitle: "Reflexiones",
  creceSubtitle: "Conociendo más de Dios",
  creceDescription: [
    "Aquí encontrarás reflexiones bíblicas y formas de aprender más de la palabra de Dios.",
    " Desde estudios bíblicos hasta reflexiones devocionales, nuestro objetivo es que crezcas en el conocimiento de nuestro Señor Jesús.",
  ],
};

// ABOUT
export const aboutTexts: AboutTexts = {
  preTitle: "¿Quiénes somos?",
  title: "For Christ",
  parrafos: [
    "Lo que comenzó hace unos años como un proyecto de enseñanza musical, hoy se ha expandido en una visión mucho más grande: que todo sea Para Cristo. En 4C, entendemos que cada aspecto de nuestras vidas, talentos y recursos, provienen de Él y son para Él.",
    "Nuestra misión es ser una fuente de recursos para cada etapa de tu camino de fe. Ya sea que estés dando tus primeros pasos o sientas el llamado a alcanzar a otros, aquí encontrarás apoyo y herramientas para crecer. Desde tutoriales musicales simplificados para tocar esas canciones que tanto ministran, hasta material evangelístico y recursos para tu crecimiento personal en la fe, nuestro propósito es equiparte.",
    'Inspirados en Romanos 11:36, creemos que "todas las cosas proceden de él, y existen por él y para él. ¡A él sea la gloria por siempre! Amén." Es con esta certeza y la ayuda del Espíritu Santo que retomamos este llamado, con una fe renovada y la convicción de que Dios expandió nuestra visión para impactar no solo a músicos, sino a todo aquel que anhela vivir una vida plena en Cristo y llevar Su mensaje.',
    "Te invitamos a explorar 4C: For Christ y a ser parte de esta comunidad donde todo lo hacemos para Su gloria.",
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
