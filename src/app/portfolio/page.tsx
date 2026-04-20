import PrincipalFooter from "@/components/PrincipalFooter";
import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col overflow-x-hidden">
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-5xl text-center font-bold mb-4">Portfolio</h1>
        <p className="text-center text-base-content/70 max-w-2xl mx-auto mb-12">
          Un vistazo a mis proyectos, emprendimientos y pasiones.
        </p>
        
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PORTFOLIO_ITEMS.map((item) => (
            <div 
              key={item.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 group overflow-hidden"
            >
              <figure className={`h-40 ${item.color} flex items-center justify-center relative`}>
                <item.icon className="w-20 h-20 text-white opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 right-3 shadow-lg">
                  <div className="badge badge-neutral font-bold shadow-md">{item.badge}</div>
                </div>
              </figure>
              <div className="card-body">
                <h2 className="card-title text-2xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h2>
                <p className="text-base-content/70 leading-relaxed min-h-[4rem]">
                  {item.description}
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link 
                    href={item.href} 
                    className="btn btn-primary btn-md group-hover:shadow-lg transition-all"
                  >
                    Ver detalles
                  </Link>
                  {item.externalLink && (
                    <a 
                      href={item.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-md group-hover:shadow-lg transition-all"
                      title={`Visitar página externa de ${item.title}`}
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <div className="divider opacity-10"></div>
      <PrincipalFooter />
    </div>
  );
}
