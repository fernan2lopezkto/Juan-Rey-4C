import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ThemeSwitcher from "./navbar-ui/ThemeSwitcher";
import UserMenu from "./navbar-ui/UserMenu";
import LoginButton from "./navbar-ui/LoginButton";
import MobileMenu from "./navbar-ui/MobileMenu";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    {
      name: 'Utilidades',
      href: '#', // Submenu parent
      sublinks: [
        { name: 'Youtube Kid Filter', href: '/youtube' },
        { name: 'Bible Quiz', href: '/utilities/biblequiz' },
        { name: 'Libreta de Acordes', href: '/utilities/libretadenotas' },
      ]
    },
  ];

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu (Button + Overlay) */}
        <MobileMenu navLinks={navLinks} session={session} />

        <Link href="/" className="btn btn-ghost text-xl normal-case hidden lg:flex">
          Juan Rey 4C
        </Link>
        <Link href="/" className="btn btn-ghost text-xl normal-case lg:hidden">
          JR
        </Link>
      </div>

      {/* Menú Desktop */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map((link) => (
            <li key={link.name}>
              {link.sublinks ? (
                <details>
                  <summary className="text-base font-medium">{link.name}</summary>
                  <ul className="p-2 bg-base-100 rounded-box z-[1] w-52 shadow">
                    {link.sublinks.map(sublink => (
                      <li key={sublink.href}>
                        <Link href={sublink.href}>{sublink.name}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link href={link.href} className="text-base font-medium">
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />

        {session?.user ? (
          <UserMenu user={session.user} />
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}
