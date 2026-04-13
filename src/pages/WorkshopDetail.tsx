import { useParams } from "react-router-dom"
import { workshops } from "../data/workshops"
import { useState } from "react"
import SignupForm from "../components/SignupForm"
import { useSignup } from "../hooks/useSignup"

export default function WorkshopDetail() {
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false)

  const { signups } = useSignup()

  const workshop = workshops.find((w) => w.id === id)

  if (!workshop) {
    return <h2>Taller no encontrado</h2>
  }

  const currentSignups = signups.filter(
    (s) => s.workshopId === workshop.id
  )

  const availableSpots = workshop.capacity - currentSignups.length

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border">
      <h1 className="text-3xl font-bold mb-4">
        {workshop.title}
      </h1>

      <p className="text-gray-600 mb-6">
        {workshop.description}
      </p>

      <div className="space-y-2 mb-6">
        <p>📅 {workshop.date}</p>
        <p>👥 {availableSpots} plazas disponibles</p>
      </div>

      {availableSpots > 0 ? (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition"
            >
            Inscribirme
          </button>

          {showForm && (
            <div className="mt-6">
              <SignupForm workshopId={workshop.id} />
            </div>
          )}
        </>
      ) : (
        <p className="text-red-500 font-medium">
          ❌ Taller completo
        </p>
      )}
    </div>
  )
}