import { PORTFOLIO_ITEMS } from "@/data/portfolio";
import { notFound } from "next/navigation";
import PrincipalFooter from "@/components/PrincipalFooter";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  return PORTFOLIO_ITEMS.map((item) => ({
    slug: item.id,
  }));
}

export default async function PortfolioItemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const item = PORTFOLIO_ITEMS.find(i => i.id === slug);
  if (!item) {
    notFound();
  }

  const IconComponent = item.icon;

  return (
    <div className="min-h-screen bg-base-200 flex flex-col overflow-x-hidden">
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow max-w-5xl">
        <Link 
          href="/portfolio" 
          className="btn btn-ghost mb-8 gap-2 hover:bg-base-300 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Portfolio
        </Link>
        
        <div className="card bg-base-100 shadow-2xl overflow-hidden border border-base-300">
          <figure className={`h-64 md:h-96 ${item.color} flex items-center justify-center relative`}>
             <IconComponent className="w-32 h-32 md:w-48 md:h-48 text-white opacity-80" />
             <div className="absolute top-4 right-4 shadow-lg">
                <div className="badge badge-neutral font-bold text-lg p-4">{item.badge}</div>
             </div>
          </figure>
          
          <div className="card-body p-6 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary">
              {item.title}
            </h1>
            
            <div className="space-y-6 text-lg text-base-content/80 leading-relaxed font-medium">
              {item.longDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {item.externalLink && (
              <div className="mt-12 flex justify-start">
                <a 
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <ExternalLink className="w-6 h-6" />
                  Visitar en Instagram
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
      <div className="divider opacity-10"></div>
      <PrincipalFooter />
    </div>
  );
}
