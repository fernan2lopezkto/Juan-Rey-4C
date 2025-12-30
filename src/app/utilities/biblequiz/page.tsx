import PrincipalFooter from "@/components/PrincipalFooter";

import BqSPAComponent from "@/components/spaPilotos/BqSPAComponent"
import RulesComponent from "@/components/spaPilotos/RulesComponent"
import { bibleQuestions } from '@/data/questions';

export default function BibleQuiz() {

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
