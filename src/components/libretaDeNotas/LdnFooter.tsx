//'use client';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function PrincipalFooter() {
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Filtro', href: '/youtube-filter' },
    { name: 'About', href: '/about' },
    { name: 'Utilidades', href: '/utilities' },
  ];

  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/fernan2lopezkto/',
      icon: <FaInstagram size={22} />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/fernan2lopezkto',
      icon: <FaGithub size={22} />,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/juan-rey-fernan2lopezkto',
      icon: <FaLinkedin size={22} />,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@cuatrocuerdas7892',
      icon: <FaYoutube size={22} />,
    },
  ];

  return (
    <footer className="footer footer-horizontal footer-center p-10 bg-base-100 text-base-content border-t border-base-300">
      {/* Sección de Navegación con estilo de botones fantasma */}
      <nav className="flex flex-wrap justify-center gap-6">
        {navLinks.map((link) => (
          <Link 
            href={link.href} 
            key={link.href} 
            className="link link-hover font-medium hover:text-primary transition-colors uppercase text-xs tracking-widest"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Redes Sociales con círculos sutiles */}
      <nav>
        <div className="grid grid-flow-col gap-5">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="p-3 bg-base-200 rounded-full hover:bg-primary hover:text-primary-content transition-all duration-300 shadow-sm"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </nav>

      {/* Marca y Copyright con fuente Mono (estilo acordes) */}
      <aside className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-primary font-bold tracking-tighter text-xl">
            <span className="bg-primary text-primary-content px-2 py-1 rounded-md">4</span>
            <span className="font-mono">Code</span>
        </div>
        <p className="font-mono text-[10px] uppercase opacity-50 tracking-widest">
          © {new Date().getFullYear()} — Handcrafted for Musicians
        </p>
      </aside>
    </footer>
  );
}
