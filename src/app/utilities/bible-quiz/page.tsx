import PrincipalFooter from "@/components/PrincipalFooter";

import BibleQuizComponent from "@/components/bible-quiz/BibleQuizComponent"
import RulesComponent from "@/components/bible-quiz/RulesComponent"
import { bibleQuestions } from '@/data/bible-questions';

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AuthPlaceholder from "@/components/AuthPlaceholder";

export default async function BibleQuiz() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return <AuthPlaceholder message="Debes loguearte para usar BibleQuiz." />;
    }

    return (
        <div className="min-h-screen p-8 flex flex-col gap-8">

            <BibleQuizComponent
                questions={bibleQuestions}
            />
            <RulesComponent />
            <PrincipalFooter />

        </div>
    );
}
