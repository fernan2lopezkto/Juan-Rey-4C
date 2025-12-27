"use client";

import { signOut } from "next-auth/react";

interface UserMenuProps {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-base-content font-medium opacity-90">{user.name}</span>
                {user.image ? (
                    <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2"
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral text-neutral-content flex items-center justify-center ring-2 ring-primary ring-offset-base-100 ring-offset-2">
                        {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
            </div>

            <button
                className="btn btn-sm btn-ghost hover:btn-error transition-colors"
                onClick={() => signOut()}
            >
                Sign Out
            </button>
        </div>
    );
}
