import { useParams } from "react-router-dom"
import { workshops } from "../data/workshops"
import { useState, useEffect } from "react"
import SignupForm from "../components/SignupForm"
import { supabase } from "../lib/supabase"

export default function WorkshopDetail() {
  const { id } = useParams()
  const [showForm, setShowForm] = useState(false)
  const [availableSpots, setAvailableSpots] = useState<number | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const workshop = workshops.find((w) => w.id === id)

  useEffect(() => {
    const fetchData = async () => {
      if (!workshop) return

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 📊 contar plazas
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshop.id)

      setAvailableSpots(workshop.capacity - (count || 0))

      // 🔍 comprobar si ya está inscrito
      if (user) {
        const { data } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("workshop_id", workshop.id)
          .maybeSingle()

        if (data) {
          setIsEnrolled(true)
        }
      }
    }

    fetchData()
  }, [workshop])

  if (!workshop) {
    return <h2>Taller no encontrado</h2>
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-4">
        {workshop.title}
      </h1>

      <p className="text-gray-600 mb-4">
        {workshop.description}
      </p>

      <p className="mb-2">📅 {workshop.date}</p>

      <p className="mb-4">
        👥{" "}
        {availableSpots !== null
          ? `${availableSpots} plazas disponibles`
          : "Cargando..."}
      </p>

      {/* 🔒 SI YA ESTÁ INSCRITO */}
      {isEnrolled ? (
        <p className="text-green-600 font-medium">
          ✅ Ya estás inscrito en este taller
        </p>
      ) : availableSpots !== null && availableSpots > 0 ? (
        <>
          <button
            onClick={() => setShowForm(true)}
            className="border border-gray-900 px-6 py-2 rounded-full hover:bg-gray-900 hover:text-white transition"
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
        <p className="text-red-500">❌ Taller completo</p>
      )}
    </div>
  )
}