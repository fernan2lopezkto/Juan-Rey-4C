"use client";

import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';
import { signIn, useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const closeMobileMenu = () => {
    if (detailsRef.current) {
      detailsRef.current.removeAttribute('open');
    }
  };

  const menuItems = (
    <>
      <li>
        <Link href="/" onClick={closeMobileMenu}>Home</Link>
      </li>
      <li>
        <Link href="/youtube-filter" onClick={closeMobileMenu}>YoutubeFilter</Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 border-b border-base-200">
      <div className="navbar-start">
        {/* Mobile Dropdown */}
        <div className="dropdown">
          <details ref={detailsRef}>
            <summary tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
            </summary>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              {menuItems}
            </ul>
          </details>
        </div>
        <Link href="/" className="btn btn-ghost text-xl normal-case">
          Juan Rey 4C
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {menuItems}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* User Info */}
        {session?.user && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-base-content font-medium">{session.user.name}</span>
            {session.user.image && (
              <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full" />
            )}
          </div>
        )}

        {/* Login/Logout */}
        {session ? (
          <button className="btn btn-sm btn-secondary ml-2" onClick={() => signOut()}>
            Sign Out
          </button>
        ) : (
          <button className="btn btn-sm btn-primary ml-2" onClick={() => signIn()}>
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}