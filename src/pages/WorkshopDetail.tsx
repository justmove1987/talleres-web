import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import SignupForm from "../components/SignupForm"
import { supabase } from "../lib/supabase"

type Workshop = {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  image: string
}

export default function WorkshopDetail() {
  const { id } = useParams()

  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [availableSpots, setAvailableSpots] = useState<number | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      // 📦 obtener workshop desde DB
      const { data: workshopData, error } = await supabase
        .from("workshops")
        .select("*")
        .eq("id", id)
        .single()

      if (error || !workshopData) {
        console.error(error)
        setLoading(false)
        return
      }

      setWorkshop(workshopData)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      // 📊 contar inscripciones
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshopData.id)

      const spots = workshopData.capacity - (count || 0)
      setAvailableSpots(spots)

      // 🔍 comprobar si ya está inscrito
      if (user) {
        const { data } = await supabase
          .from("enrollments")
          .select("*")
          .eq("user_id", user.id)
          .eq("workshop_id", workshopData.id)
          .maybeSingle()

        if (data) {
          setIsEnrolled(true)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [id])

  if (loading) {
    return <p className="mt-20 text-center">Cargando taller...</p>
  }

  if (!workshop) {
    return <h2 className="mt-20 text-center">Taller no encontrado</h2>
  }

  return (
    <div className="max-w-4xl mx-auto px-6">

      {/* 🖼 imagen */}
      {workshop.image && (
        <img
          src={workshop.image}
          alt={workshop.title}
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

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

      {/* 🔒 YA INSCRITO */}
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
              <SignupForm
                workshopId={workshop.id}
                capacity={workshop.capacity} // 🔥 importante
              />
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