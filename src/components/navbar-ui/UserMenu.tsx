"use client";

import Link from "next/link";

interface UserMenuProps {
    user: {
        name?: string | null;
        image?: string | null;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    return (
        <Link 
            href="/profile" 
            className="flex items-center gap-2 group cursor-pointer transition-all active:scale-95"
        >
            <span className="hidden md:block text-sm font-medium opacity-90 group-hover:text-primary transition-colors">
                {user.name}
            </span>

            {user.image ? (
                <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 group-hover:ring-secondary transition-all"
                />
            ) : (
                <div className="w-9 h-9 rounded-full bg-neutral text-neutral-content flex items-center justify-center ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                    {user.name?.[0]?.toUpperCase() || "U"}
                </div>
            )}
        </Link>
    );
}
