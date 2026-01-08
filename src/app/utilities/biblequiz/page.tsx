import PrincipalFooter from "@/components/PrincipalFooter";

import BqSPAComponent from "@/components/spaPilotos/BqSPAComponent"
import RulesComponent from "@/components/spaPilotos/RulesComponent"
import { bibleQuestions } from '@/data/questions';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthPlaceholder from "@/components/AuthPlaceholder";

export default async function BibleQuiz() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <AuthPlaceholder message="Debes loguearte para usar el Bible Quiz." />;
    }

    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">

            <BqSPAComponent
                questions={bibleQuestions}
            />
            <RulesComponent />
            <PrincipalFooter />

        </div>
    );
}
