import PrincipalFooter from "@/components/PrincipalFooter";
import BibleQuizComponent from "@/components/bible-quiz/BibleQuizComponent";
import RulesComponent from "@/components/bible-quiz/RulesComponent";
import BibleQuizProDashboard from "@/components/bible-quiz/BibleQuizProDashboard";
import { bibleQuestions } from '@/data/bible-questions';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getBibleQuizProgress } from "@/app/actions/bibleQuizActions";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function BibleQuiz() {
    const session = await getServerSession(authOptions);
    
    let userPlan = "basic";

    if (session?.user?.email) {
        try {
            const [dbUser] = await db
                .select({ plan: users.plan })
                .from(users)
                .where(eq(users.email, session.user.email))
                .limit(1);
            if (dbUser) {
                userPlan = dbUser.plan;
            }
        } catch (error) {
            console.error("Error fetching user plan:", error);
        }
    }

    const isProOrLearning = userPlan === "pro" || userPlan === "learning" || userPlan === "admin";

    let dbProgress: any[] = [];
    if (isProOrLearning && session) {
        const progressRes = await getBibleQuizProgress();
        if (progressRes.success) {
            dbProgress = progressRes.progress || [];
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex-grow p-4 md:p-8">
                {isProOrLearning ? (
                    // VISTA PARA USUARIOS PRO/LEARNING: Modos Historia y Libre
                    <BibleQuizProDashboard initialProgress={dbProgress} />
                ) : (
                    // VISTA PARA USUARIOS NUEVOS O BASICOS: Demo con LocalStorage
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold font-serif mb-2">Bible Quiz (Demo)</h1>
                            <p className="opacity-70">Sube a un plan Pro o Learning para desbloquear el Modo Historia y Modo Libre.</p>
                        </div>
                        {/* Diseño dividido en escritorio */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3">
                                <BibleQuizComponent questions={bibleQuestions} />
                            </div>
                            <div className="w-full lg:w-1/3">
                                <RulesComponent />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <PrincipalFooter />
        </div>
    );
}
