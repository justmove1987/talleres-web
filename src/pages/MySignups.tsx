import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

// 🔹 tipos
type Workshop = {
  title: string
  date: string
  description: string
  image: string | null
}

type EnrollmentWithWorkshop = {
  id: string
  workshop: Workshop | null
}

// 🔥 type guard REAL
function isWorkshop(w: unknown): w is Workshop {
  return (
    typeof w === "object" &&
    w !== null &&
    "title" in w &&
    "date" in w &&
    "description" in w &&
    "image" in w
  )
}

export default function MySignups() {
  const [enrollments, setEnrollments] = useState<EnrollmentWithWorkshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("enrollments")
        .select(`
          id,
          workshop:workshops (
            title,
            date,
            description,
            image
          )
        `)
        .eq("user_id", user.id)

      if (error) {
        console.error(error)
      } else if (data) {
        const formatted: EnrollmentWithWorkshop[] = data.map((item) => {
          const w = item.workshop

          return {
            id: String(item.id),
            workshop: isWorkshop(w)
              ? {
                  title: String(w.title),
                  date: String(w.date),
                  description: String(w.description),
                  image: w.image ? String(w.image) : null,
                }
              : null,
          }
        })

        setEnrollments(formatted)
      }

      setLoading(false)
    }

    fetchEnrollments()
  }, [])

  if (loading) {
    return <p className="mt-20 text-center">Cargando...</p>
  }

  if (enrollments.length === 0) {
    return (
      <p className="mt-20 text-center">
        No tienes inscripciones aún
      </p>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-6">
        Mis inscripciones
      </h1>

      <div className="space-y-4">
        {enrollments.map((enrollment) => {
          const workshop = enrollment.workshop

          return (
            <div
              key={enrollment.id}
              className="bg-white p-5 rounded-xl border"
            >
              {workshop ? (
                <>
                  {workshop.image && (
                    <img
                      src={workshop.image}
                      alt={workshop.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}

                  <h2 className="font-display text-xl">
                    {workshop.title}
                  </h2>

                  <p className="text-sm text-gray-500">
                    📅 {workshop.date}
                  </p>

                  <p className="text-sm text-gray-600 mt-2">
                    {workshop.description}
                  </p>
                </>
              ) : (
                <p className="text-red-500">
                  Taller no disponible
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}