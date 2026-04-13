import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div>

      {/* HERO */}
      <section
  className="relative h-screen bg-cover bg-center flex items-center justify-center text-white text-center"
  style={{
    backgroundImage:
      "url('https://edicionsclariana.cat/jardineria/image.png')",
  }}
>

  {/* 🔥 GRADIENTE SUPERIOR */}
  <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-black/70 to-transparent z-10" />

  {/* CONTENIDO */}
  <div className="relative z-20 bg-black/30 p-8 rounded-xl">
    <h1 className="text-6xl mb-4 font-display">
      Plain Air
    </h1>

    <p className="text-lg mb-6 font-body max-w-xl">
      Talleres artísticos en tu barrio. Crea, experimenta y conecta.
    </p>

    <Link to="/talleres">
  <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
    Ver talleres
  </button>
</Link>
  </div>
</section>

    </div>
  )
}