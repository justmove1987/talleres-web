import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Link } from "react-router-dom"

type Workshop = {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  image: string | null
}

export default function Workshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data, error } = await supabase
        .from("workshops")
        .select("*")
        .order("date", { ascending: true })

      if (error) {
        console.error("❌ ERROR FETCH:", error)
      } else {
        setWorkshops(data || [])
      }

      setLoading(false)
    }

    fetchWorkshops()
  }, [])

  if (loading) {
    return <p className="text-center mt-20">Cargando talleres...</p>
  }

  if (workshops.length === 0) {
    return <p className="text-center mt-20">No hay talleres</p>
  }

  return (
    <div className="max-w-5xl mx-auto px-6">
      <h1 className="text-3xl font-display mb-8">Talleres</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {workshops.map((w) => {
          const imageSrc =
            w.image && w.image.startsWith("http")
              ? `${w.image}?v=${w.id}`
              : "/placeholder.png"

          return (
            <div
              key={w.id}
              className="bg-white rounded-2xl overflow-hidden border hover:shadow-md transition"
            >
              <img
                src={imageSrc}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.png"
                }}
              />

              <div className="p-5">
                <h2 className="text-xl font-display">{w.title}</h2>
                <p className="text-sm text-gray-600">{w.description}</p>
                <p className="text-xs text-gray-400 mt-2">📅 {w.date}</p>
                <p className="text-xs text-gray-500">👥 {w.capacity}</p>

                <Link to={`/talleres/${w.id}`}>
                  <button className="mt-3 border px-3 py-1 rounded-full">
                    Ver detalle
                  </button>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}