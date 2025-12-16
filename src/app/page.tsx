

import HeroUno from '@components/Hero1'
import FooterUno from '@components/Footer1'

export default function Home() {
  return (
    <div>
      <HeroUno />
    <div className="px-12 text-center mt-12">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row">
          <img
            src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
            className="max-w-sm rounded-lg shadow-2xl"
          />
          <div>
            <h1 className="text-5xl font-bold">Juan Rey 4C</h1>
            <p className="py-6">
              Utilidades de todo tipo, portfolio y CV
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </div>
    <FooterUno />
</div>
  );
}
