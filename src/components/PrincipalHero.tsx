import Link from 'next/link';

export default function PrincipalHero() {
  return (
    <div
      className="hero min-h-[80vh] bg-center"
      style={{
        backgroundImage:
          "url('/fondoCrucesUno.jpg')",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">4C = For Christ</h1>
          <p className="mb-5 ">
            Lo que antes fue{" "}
            <a 
              href="https://m.youtube.com/@cuatrocuerdas7892" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="link link-hover text-primary font-semibold"
            >
              Cuatro Cuerdas
            </a>{" "}
            bajo las siglas 4C, hoy se transforma en{" "}
            <Link 
              href="/youtube-filter" 
              className="link link-hover text-primary font-semibold"
            >
              4C - For Christ
            </Link>.
          </p>
          <p className="mb-5 mt-5 italic">
            Porque de él, y por él, y para él,
            son todas las cosas.
          </p>
          <p className="mb-5 font-bold">
            Romanos 11:36 RVR1960
          </p>
        </div>
      </div>
    </div>
  )
}
