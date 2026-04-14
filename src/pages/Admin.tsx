import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Enrollment = {
  id: string
  user_id: string
  workshop_id: string
}

type Workshop = {
  id: string
  title: string
  capacity: number
}

export default function Admin() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      // 🔐 usuario
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      // 📦 traer workshops
      const { data: workshopsData } = await supabase
        .from("workshops")
        .select("*")

      // 📦 traer enrollments
      const { data: enrollmentsData } = await supabase
        .from("enrollments")
        .select("*")

      const enrollmentsList = enrollmentsData || []
      const workshopsList = workshopsData || []

      setEnrollments(enrollmentsList)
      setWorkshops(workshopsList)

      // 📊 calcular stats
      const counts: Record<string, number> = {}

      enrollmentsList.forEach((e) => {
        counts[e.workshop_id] =
          (counts[e.workshop_id] || 0) + 1
      })

      setStats(counts)

      setLoading(false)
    }

    fetchData()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("¿Eliminar inscripción?")
    if (!confirmDelete) return

    const { error } = await supabase
      .from("enrollments")
      .delete()
      .eq("id", id)

    if (error) {
      alert("Error al eliminar")
      console.error(error)
      return
    }

    // actualizar lista
    setEnrollments((prev) =>
      prev.filter((e) => e.id !== id)
    )

    // actualizar stats
    setStats((prev) => {
      const updated = { ...prev }
      const deleted = enrollments.find((e) => e.id === id)

      if (deleted) {
        updated[deleted.workshop_id] =
          Math.max((updated[deleted.workshop_id] || 1) - 1, 0)
      }

      return updated
    })
  }

  if (loading) {
    return <p className="mt-10 text-center">Cargando...</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-6">
        Panel Admin
      </h1>

      {/* 📊 ESTADÍSTICAS */}
      <div className="mb-10">
        <h2 className="text-2xl font-display mb-4">
          Estadísticas
        </h2>

        <div className="space-y-4">
          {workshops.map((w) => {
            const count = stats[w.id] || 0
            const percentage = (count / w.capacity) * 100

            const color =
              percentage > 80
                ? "bg-red-500"
                : percentage > 50
                ? "bg-yellow-500"
                : "bg-green-500"

            return (
              <div key={w.id}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{w.title}</span>
                  <span>
                    {count} / {w.capacity}
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 📋 LISTADO */}
      <div className="space-y-4">
        {enrollments.map((enrollment) => {
          const workshop = workshops.find(
            (w) => w.id === enrollment.workshop_id
          )

          return (
            <div
              key={enrollment.id}
              className="bg-white p-4 rounded-xl border shadow-sm flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">
                  {enrollment.user_id}
                </p>

                <p className="font-display text-lg">
                  {workshop?.title || "Taller eliminado"}
                </p>
              </div>

              <button
                onClick={() => handleDelete(enrollment.id)}
                className="text-sm border border-red-500 text-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition"
              >
                Eliminar
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}