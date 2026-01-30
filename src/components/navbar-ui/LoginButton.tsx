"use client";

import Link from "next/link";

export default function LoginButton() {
    return (
        <Link 
            href="/login" 
            className="btn btn-sm btn-primary animate-pulse hover:animate-none"
        >
            Sign In
        </Link>
    );
}
