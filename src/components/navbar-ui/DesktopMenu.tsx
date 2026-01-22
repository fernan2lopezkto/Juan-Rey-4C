"use client";

import Link from 'next/link';
import { NavigationItem } from '@/utils/texts';

interface DesktopMenuProps {
    navLinks: NavigationItem[];
}

export default function DesktopMenu({ navLinks }: DesktopMenuProps) {
    return (
        <ul className="menu menu-horizontal px-1">
            {navLinks.map((link) => (
                <li key={link.label}>
                    {link.submenu ? (
                        <details>
                            <summary className="text-base font-medium">{link.label}</summary>
                            <ul className="p-2 bg-base-100 rounded-box z-[1] w-52 shadow">
                                {link.submenu.map((sublink: NavigationItem) => (
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
    );
}
