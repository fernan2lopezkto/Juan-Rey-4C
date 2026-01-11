// --- INTERFACES ---

interface NavigationItem {
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

// ABOUT
export const aboutTexts: AboutTexts = {
  preTitle: "Hola Mundo!",
  title: "For Christ",
  parrafos: [
    "Soy Juan Rey, Uruguayo, padre de dos hermosos hijos. Fui musico, fotógrafo, emprendedor y varias cosas mas, y hoy a través de esta plataforma, quiero aprovechar mi pasion por el desarrollo de software, para unificar ideas, proyectos y portafolio.",
    "Con 12 añitos comencé a aprender música, mi tío Luis, me regaló un órgano y un cancionero, de esos que venían con todas las notas arriba de la letra y al final dibujos de como hacer los acordes, así comenzó algo que cambio el resto de mi vida. Luego aprendí a tocar la guitarra viendo como tocaban mis compañeros en el grupo, y hace unos cuantos años (cuando necesite tocar bajo, porque era necesario en el grupo de alabanza donde estaba) descubrí cuánto amo ese instrumento de CUATRO CUERDAS lo que dió inicio al canal de YouTube ",
    
  ],
};