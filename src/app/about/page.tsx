import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div className="min-h-screen bg-base-200 p-8">
            <h1 classNam="">
                {aboutTexts.pretitle}
            </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          {aboutTexts.parrafos.map((parrafo) => (
            <p key={parrafo} className="mt-1 ">
              {parrafo}
            </p>
          ))}
        </div>
            <PrincipalFooter />
        </div>
    );
}
