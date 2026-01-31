import Link from 'next/link';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ThemeSwitcher from "./navbar-ui/ThemeSwitcher";
//import UserMenu from "./navbar-ui/UserMenu";
import LoginButton from "./navbar-ui/LoginButton";
import MobileMenu from "./navbar-ui/MobileMenu";

import { navigationItems } from "@/utils/texts";

import DesktopMenu from "./navbar-ui/DesktopMenu";

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
        <DesktopMenu navLinks={navigationItems} />
      </div>

      <div className="navbar-end gap-2">
        <ThemeSwitcher />

        {session?.user ? (
          <></>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
}
