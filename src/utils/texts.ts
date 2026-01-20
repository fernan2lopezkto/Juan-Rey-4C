// --- INTERFACES ---

export interface NavigationItem {
  label: string;
  href: string;
  submenu?: NavigationItem[];
}

interface AboutTexts {
  preTitle: string;
  title: string;
  parrafos: string[];
}

// --- CONFIGURACIÓN ---

// NavBars
export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Utilidades",
    href: "#",
    submenu: [
      { label: "Youtube Kid Filter", href: "/youtube" },
      { label: "Bible Quiz", href: "/utilities/biblequiz" },
      { label: "Libreta de Acordes", href: "/utilities/libretadenotas" },
    ],
  },
];

// ABOUT
export const aboutTexts: AboutTexts = {
  preTitle: "Hola Mundo!",
  title: "For Christ",
  parrafos: [
    "Soy Juan Rey, uruguayo, padre, músico,  desarrollador de software y mucho más. Mi camino musical inició a los 12 años cuando mi tío Luis me regaló un órgano y un cancionero; ese gesto cambió mi destino para siempre. Con el tiempo, aprendí guitarra observando a mis compañeros de grupo y, años después, la necesidad de tocar bajo en mi congregación me hizo descubrir un amor profundo por el instrumento de cuatro cuerdas, lo que dio vida a mi canal de YouTube.",
    "Aunque el bajo es mi instrumento favorito, mis tutoriales se enfocaron mayormente en la guitarra, buscando ayudar a quienes recién comienzan. Mi objetivo siempre fue adaptar canciones a su forma más sencilla para motivar a la audiencia y servir como punto de partida. Hoy, utilizo esta plataforma para unificar mis ideas y portafolio, aprovechando mi formación en desarrollo de software, fotografía y logística para crear un espacio digital con sentido.",
    'Con una nueva madurez y prioridades claras, he decidido darle un sentido más profundo al concepto de "4C". Lo que antes significaba simplemente "Cuatro Cuerdas", hoy se transforma en "For-Christ" (Para Cristo). Mi identidad no reside en mis oficios, sino en Jesucristo, reconociendo que de Él, por Él y para Él son todas las cosas. Este sitio es el reflejo de esa transición: una mezcla de tecnología, arte y propósito bajo Su guía.',
  ],
};