"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaShieldAlt, FaSignOutAlt, FaGoogle, FaKey } from "react-icons/fa";

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-ring loading-lg text-primary"></span>
            </div>
        );
    }

    // Aunque el middleware protege la ruta, este check extra evita flashes de contenido
    if (!session) {
        router.push("/login");
        return null;
    }

    const user = session.user;
    // @ts-ignore
    const provider = user?.provider;

    return (
        <div className="min-h-screen bg-base-200 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header del Perfil */}
                <div className="card bg-base-100 shadow-xl overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -mt-16 mb-6">
                            <div className="avatar">
                                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-100">
                                    {user?.image ? (
                                        <img src={user.image} alt={user.name || "Avatar"} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full bg-neutral text-neutral-content text-4xl">
                                            {user?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">{user?.name}</h1>
                                <p className="text-base-content/60 flex items-center gap-2 mt-1">
                                    <FaEnvelope className="text-sm" /> {user?.email}
                                </p>
                            </div>
                            <button 
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="btn btn-outline btn-error gap-2"
                            >
                                <FaSignOutAlt /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>

                {/* Detalles de Seguridad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title flex items-center gap-2">
                                <FaShieldAlt className="text-primary" /> 
                                Método de Conexión
                            </h2>
                            <div className="mt-4 p-4 rounded-lg bg-base-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {provider === "google" ? (
                                        <>
                                            <FaGoogle className="text-error text-2xl" />
                                            <div>
                                                <p className="font-bold">Google Account</p>
                                                <p className="text-xs opacity-60">Sincronizado correctamente</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <FaKey className="text-warning text-2xl" />
                                            <div>
                                                <p className="font-bold">Contraseña</p>
                                                <p className="text-xs opacity-60">Credenciales locales</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="badge badge-success badge-outline">Activo</div>
                            </div>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-md">
                        <div className="card-body">
                            <h2 className="card-title flex items-center gap-2">
                                <FaUser className="text-secondary" />
                                Estado de Cuenta
                            </h2>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-sm border-b pb-2">
                                    <span className="opacity-70">Email Verificado:</span>
                                    <span className="font-mono text-success">SÍ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="opacity-70">Rol de usuario:</span>
                                    <span className="badge badge-ghost badge-sm">Miembro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
