import PrincipalFooter from "@/components/PrincipalFooter";
import ToolsCarousel from "@/components/ToolsCarousel";
import { TOOLS } from "@/data/tools";
import Link from "next/link";

export default function Utilities() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col overflow-x-hidden">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-5xl text-center font-bold mb-12">Utilidades</h1>
        
        {/* Mobile View: Grid */}
        <section className="grid grid-cols-1 gap-8 md:hidden">
          {TOOLS.map((tool, index) => (
            <div 
              key={index}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 group"
            >
              <figure className="relative h-48 overflow-hidden">
                <img 
                  src={tool.image} 
                  alt={tool.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2">
                  <div className="badge badge-primary font-bold shadow-lg">{tool.badge}</div>
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
                  {tool.title}
                </h2>
                <p className="text-base-content/70 leading-relaxed">
                  {tool.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={tool.href} 
                    className="btn btn-primary btn-md group-hover:shadow-lg transition-all"
                  >
                    Entrar ahora
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Desktop View: Carousel */}
        <section className="hidden md:block">
          <ToolsCarousel tools={TOOLS} />
        </section>
      </main>

      <div className="divider opacity-10"></div>
      <PrincipalFooter />
    </div>
  );
}
