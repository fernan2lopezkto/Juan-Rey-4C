import { Briefcase, Camera, Printer } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LucideProps } from "lucide-react";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  longDescription: string[];
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  badge: string;
  href: string;
  externalLink?: string;
  color: string;
}

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: "castillos-del-rey",
    title: "Castillos del Rey",
    description: "Emprendimiento de alquiler de castillos inflables para eventos y cumpleaños infantiles.",
    longDescription: [
      "Castillos del Rey es un emprendimiento dedicado a llevar diversión y alegría a los más pequeños en sus días especiales.",
      "Ofrecemos servicios de alquiler de castillos inflables de alta calidad, asegurando que cada cumpleaños, evento familiar o celebración comunitaria sea inolvidable y segura.",
      "Nuestra misión es hacer sonreír a los niños y facilitar la planificación a los padres, brindando un servicio puntual y un producto que cumpla con los estándares de seguridad."
    ],
    icon: Briefcase,
    badge: "Emprendimiento",
    href: "/portfolio/castillos-del-rey",
    externalLink: "https://www.instagram.com/castillos_del_rey",
    color: "bg-blue-500",
  },
  {
    id: "4cphotograph",
    title: "4Cphotograph",
    description: "Mis tiempos de fotógrafo, capturando momentos únicos bajo el lente.",
    longDescription: [
      "4Cphotograph representa la etapa en mi vida donde la cámara fue mi herramienta principal para contar historias. Una pasión que me permitió congelar el tiempo y capturar la belleza de momentos irrepetibles.",
      "A lo largo de mi experiencia en fotografía, me dediqué a perfeccionar mi técnica y a entender que cada disparo es una oportunidad de documentar algo verdadero y emocional."
    ],
    icon: Camera,
    badge: "Fotografía",
    href: "/portfolio/4cphotograph",
    color: "bg-emerald-500",
  },
  {
    id: "esrprint",
    title: "ESRprint",
    description: "Estampado y sublimación de primera calidad.",
    longDescription: [
      "ESRprint es mi proyecto de diseño y personalización de productos mediante técnicas de estampado y sublimación.",
      "Trabajamos con tazas, prendas de vestir y más, transformando ideas creativas en objetos reales y duraderos que nuestros clientes pueden disfrutar día a día."
    ],
    icon: Printer,
    badge: "Emprendimiento",
    href: "/portfolio/esrprint",
    externalLink: "https://www.instagram.com/esrprint_uy/",
    color: "bg-red-500",
  }
];
