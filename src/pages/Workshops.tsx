import { workshops } from "../data/workshops"
import { Link } from "react-router-dom"

export default function Workshops() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Talleres disponibles</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {workshops.map((workshop) => (
          <div
            key={workshop.id}
            className="bg-white p-6 rounded-2xl border hover:shadow-lg hover:-translate-y-1 transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              {workshop.title}
            </h2>

            <p className="text-gray-600 mb-4">
              {workshop.description}
            </p>

            <p className="text-sm text-gray-500">
              📅 {workshop.date}
            </p>

            <Link to={`/talleres/${workshop.id}`}>
              <button className="mt-4 border border-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition">
                Ver detalle
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}