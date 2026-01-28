"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
    return (
        <button
            className="btn btn-sm btn-primary animate-pulse hover:animate-none"
            onClick={() => signIn("google")}
        >
            Sign In
        </button>
    );
}
