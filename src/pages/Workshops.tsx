import { workshops } from "../data/workshops"
import type { Workshop } from "../data/workshops"
import { Link } from "react-router-dom"

export default function Workshops() {
  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-8">
        Talleres
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {workshops.map((workshop: Workshop) => (
          <div
            key={workshop.id}
            className="bg-white rounded-2xl overflow-hidden border hover:shadow-md hover:-translate-y-1 transition"
          >
            {/* IMAGEN */}
            <img
              src={workshop.image}
              alt={workshop.title}
              className="w-full h-48 object-cover"
            />

            {/* CONTENIDO */}
            <div className="p-5">
              <h2 className="text-xl font-display mb-2">
                {workshop.title}
              </h2>

              <p className="text-gray-600 font-body text-sm mb-3">
                {workshop.description}
              </p>

              <p className="text-xs text-gray-400">
                📅 {workshop.date}
              </p>

              <Link to={`/talleres/${workshop.id}`}>
                <button className="mt-4 border border-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition">
                  Ver detalle
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}