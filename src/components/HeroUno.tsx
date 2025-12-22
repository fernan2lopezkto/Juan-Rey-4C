

export default function HeroUno() {
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
          <p className="mb-5 text-2xl">
            Lo que antes fue Cuatro Cuerdas bajo las siglas 4C, 
            hoy se transforma en 4C - For Christ.
          </p>
          <p className="mb-5">
            Porque de él, y por él, y para él,
            son todas las cosas.
          </p>
          <p className="mb-5">
            Romanos 11:36 RVR1960
          </p>
        </div>
      </div>
    </div>


  )
}