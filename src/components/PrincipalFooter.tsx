import Link from 'next/link';
import { FaGithub, FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';

export default function PrincipalFooter() {
  // Arreglo para la navegación principal
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Filtro', href: '/youtube-filter' },
    { name: 'About', href: '/about' },
    { name: 'Utilidades', href: '/utilities' },
  ];

  // Arreglo para redes sociales extraídas de tu Linktree
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/fernan2lopezkto/',
      icon: <FaInstagram size={24} />,
    },
    {
      name: 'GitHub',
      href: 'https://github.com/fernan2lopezkto',
      icon: <FaGithub size={24} />,
    },
    {
      name: 'LinkedIn',
      href: 'https://www.linkedin.com/in/juan-rey-fernan2lopezkto',
      icon: <FaLinkedin size={24} />,
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@cuatrocuerdas7892',
      icon: <FaYoutube size={24} />,
    },
  ];

  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content rounded p-10">
      {/* Navegación de Páginas */}
      <nav className="grid grid-flow-col gap-4">
        {navLinks.map((link) => (
          <Link href={link.href} key={link.href} className="link link-hover">
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Redes Sociales Dinámicas */}
      <nav>
        <div className="grid grid-flow-col gap-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              className="hover:text-primary transition-colors"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </nav>

      <aside>
        <p>Copyright © {new Date().getFullYear()} - 4Code</p>
      </aside>
    </footer>
  );
}
