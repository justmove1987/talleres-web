import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { workshops } from "../data/workshops"

type Enrollment = {
  id: string
  workshop_id: string
}

export default function MySignups() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEnrollments = async () => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)

      if (error) {
        console.error(error)
      } else {
        setEnrollments(data || [])
      }

      setLoading(false)
    }

    fetchEnrollments()
  }, [])

  if (loading) {
    return <p>Cargando...</p>
  }

  if (enrollments.length === 0) {
    return <p>No tienes inscripciones aún</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-6">
        Mis inscripciones
      </h1>

      <div className="space-y-4">
        {enrollments.map((enrollment) => {
          const workshop = workshops.find(
            (w) => w.id === enrollment.workshop_id
          )

          return (
            <div
              key={enrollment.id}
              className="bg-white p-5 rounded-xl border"
            >
              <h2 className="font-display text-xl">
                {workshop?.title}
              </h2>

              <p className="text-sm text-gray-500">
                📅 {workshop?.date}
              </p>

              <p className="text-sm text-gray-600 mt-2">
                {workshop?.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}