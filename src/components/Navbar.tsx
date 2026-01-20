import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ThemeSwitcher from "./navbar-ui/ThemeSwitcher";
import UserMenu from "./navbar-ui/UserMenu";
import LoginButton from "./navbar-ui/LoginButton";
import MobileMenu from "./navbar-ui/MobileMenu";

import { navigationItems } from "@/utils/texts";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="navbar bg-base-100 border-b border-base-200 sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile Menu (Button + Overlay) */}
        <MobileMenu navLinks={navigationItems} session={session} />

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
          {navigationItems.map((link) => (
            <li key={link.label}>
              {link.submenu ? (
                <details>
                  <summary className="text-base font-medium">{link.label}</summary>
                  <ul className="p-2 bg-base-100 rounded-box z-[1] w-52 shadow">
                    {link.submenu.map(sublink => (
                      <li key={sublink.href}>
                        <Link
                          href={sublink.href}
                          onClick={(e) => {
                            // Cierra el menú details al hacer click
                            const details = e.currentTarget.closest('details');
                            if (details) details.removeAttribute('open');
                          }}
                        >
                          {sublink.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link href={link.href} className="text-base font-medium">
                  {link.label}
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
