"use client";

import { useState } from 'react';
import Link from 'next/link';

interface NavLink {
    name: string;
    href: string;
    sublinks?: NavLink[];
}

interface MobileMenuProps {
    navLinks: NavLink[];
    session: any;
}

export default function MobileMenu({ navLinks, session }: MobileMenuProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <button
                onClick={toggleMenu}
                className="btn btn-ghost lg:hidden"
                aria-label="Abrir menú"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* OVERLAY DE MENÚ MÓVIL (PANTALLA COMPLETA) */}
            <div className={`fixed inset-0 z-[100] bg-base-100 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:hidden`}>
                <div className="flex flex-col h-full p-6">
                    {/* Botón Cerrar */}
                    <div className="flex justify-end">
                        <button onClick={closeMenu} className="btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Enlaces del menú centrados */}
                    <div className="flex flex-col items-center justify-center flex-grow">
                        <ul className="menu menu-vertical items-center gap-4 w-full text-center">
                            {navLinks.map((link) => (
                                <li key={link.name} className="w-full">
                                    {link.sublinks ? (
                                        <details>
                                            <summary className="text-2xl justify-center py-4">{link.name}</summary>
                                            <ul>
                                                {link.sublinks.map(sublink => (
                                                    <li key={sublink.href}>
                                                        <Link href={sublink.href} onClick={closeMenu} className="text-xl">
                                                            {sublink.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    ) : (
                                        <Link href={link.href} onClick={closeMenu} className="text-2xl justify-center">
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                            {session?.user && (
                                <li className="mt-4 flex flex-col items-center gap-2">
                                    <img src={session.user.image || ""} alt="User" className="w-16 h-16 rounded-full border-2 border-primary" />
                                    <span className="text-xl font-bold">{session.user.name}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}
