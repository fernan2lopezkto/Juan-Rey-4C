"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { changeUserPlan } from "@/app/actions/userActions";
import PrincipalFooter from "@/components/PrincipalFooter";
import { FaCheckCircle, FaStar, FaMusic, FaBook, FaGamepad, FaCrown, FaMagic, FaShieldAlt } from "react-icons/fa";

const PLANS = [
    {
        id: "basic",
        name: "Basic",
        icon: <FaCheckCircle className="text-xl" />,
        color: "bg-base-200 text-base-content",
        description: "Funciones básicas de la plataforma.",
        features: ["Acceso a utilidades públicas", "Perfil de usuario"]
    },
    {
        id: "music",
        name: "Music",
        icon: <FaMusic className="text-xl" />,
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        description: "Para los amantes de la música.",
        features: ["Libreta de notas completa", "Filtro de YouTube", "Todo de Basic"]
    },
    {
        id: "learning",
        name: "Learning",
        icon: <FaBook className="text-xl" />,
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        description: "Enfocado en el aprendizaje continuo.",
        features: ["Bible Quiz (Modo Historia)", "Materiales de estudio", "Todo de Basic"]
    },
    {
        id: "play",
        name: "Play",
        icon: <FaGamepad className="text-xl" />,
        color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
        description: "Acceso a todos los juegos interactivos.",
        features: ["Todos los minijuegos", "Puntuaciones globales", "Todo de Basic"]
    },
    {
        id: "pro",
        name: "Pro",
        icon: <FaStar className="text-xl" />,
        color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        description: "Experiencia completa sin restricciones.",
        features: ["Acceso total a todas las apps", "Sin anuncios", "Soporte prioritario"]
    }
];

export default function PlansPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [currentPlan, setCurrentPlan] = useState<string>("basic");
    const [isLoading, setIsLoading] = useState<string | null>(null);

    useEffect(() => {
        if (session?.user) {
            // @ts-ignore
            setCurrentPlan(session.user.plan || "basic");
        }
    }, [session]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!session) {
        router.push("/login");
        return null;
    }

    const handleSelectPlan = async (planId: string) => {
        setIsLoading(planId);
        const res = await changeUserPlan(planId);
        if (res.success) {
            setCurrentPlan(planId);
            // Mostrar un pequeño retraso antes de redirigir o actualizar
            setTimeout(() => {
                setIsLoading(null);
                // Forzamos actualización de la página o recarga para refrescar sesión si fuera necesario
                router.refresh(); 
                router.push("/profile");
            }, 1000);
        } else {
            setIsLoading(null);
            alert("Hubo un error al cambiar el plan");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-base-200">
            <div className="flex-grow py-12 px-4 max-w-7xl mx-auto w-full">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Elige tu Plan</h1>
                    <p className="text-lg opacity-70 max-w-2xl mx-auto">
                        Selecciona el plan que mejor se adapte a tus necesidades. ¡Por tiempo limitado, todos nuestros planes son 100% gratuitos!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {PLANS.map((plan) => {
                        const isCurrent = currentPlan === plan.id;
                        const isChanging = isLoading === plan.id;

                        return (
                            <div 
                                key={plan.id} 
                                className={`card shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                                    isCurrent ? 'ring-4 ring-primary' : 'hover:shadow-2xl'
                                }`}
                            >
                                <div className={`card-body rounded-2xl ${plan.color}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                            {plan.icon}
                                        </div>
                                        {isCurrent && (
                                            <div className="badge badge-primary font-bold shadow-sm">Plan Actual</div>
                                        )}
                                    </div>
                                    
                                    <h2 className="card-title text-2xl font-bold">{plan.name}</h2>
                                    <p className="text-sm font-medium opacity-90 mt-2 min-h-[40px]">
                                        {plan.description}
                                    </p>
                                    
                                    <div className="my-4 font-bold text-3xl flex items-baseline gap-1">
                                        $0 <span className="text-sm font-normal opacity-70">/ mes</span>
                                    </div>

                                    <ul className="space-y-2 mt-4 mb-6 flex-grow">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm font-medium">
                                                <FaCheckCircle className="opacity-70 text-xs" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="card-actions justify-end mt-auto">
                                        <button 
                                            onClick={() => handleSelectPlan(plan.id)}
                                            disabled={isCurrent || isLoading !== null}
                                            className={`btn w-full shadow-sm ${
                                                isCurrent ? 'btn-disabled opacity-50' 
                                                : 'bg-white/20 hover:bg-white/40 text-current border-none backdrop-blur-sm'
                                            }`}
                                        >
                                            {isChanging ? (
                                                <span className="loading loading-spinner loading-sm"></span>
                                            ) : isCurrent ? (
                                                "Seleccionado"
                                            ) : (
                                                "Elegir Plan"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <PrincipalFooter />
        </div>
    );
}
