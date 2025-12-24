import { aboutTexts } from "@/utils/texts";
import PrincipalFooter from "@/components/PrincipalFooter";

export default function About() {
    return (
        <div className=" p-8">
            <div
      className=" min-h-[80vh] bg-center"
      style={{
        backgroundImage:
          "url('/fondoCrucesUno.jpg')",
      }}
    >
            <h1 className="text-2xl text-secondary font-semibold my-4">
                {aboutTexts.preTitle}
            </h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 text-secondary-content gap-2">
          {aboutTexts.parrafos.map((parrafo) => (
            <p key={parrafo} className="mt-1 ">
              {parrafo}
            </p>
          ))}
        </div>
        </div>
            <PrincipalFooter />
        </div>
    );
}
