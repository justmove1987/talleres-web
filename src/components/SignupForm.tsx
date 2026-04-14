import { useState } from "react"
import { supabase } from "../lib/supabase"

type Props = {
  workshopId: string
  capacity: number
}

export default function SignupForm({ workshopId, capacity }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // 🔐 usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setMessage("Debes iniciar sesión")
        setLoading(false)
        return
      }

      // 🔍 comprobar duplicado (extra seguridad frontend)
      const { data: existing } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user.id)
        .eq("workshop_id", workshopId)
        .maybeSingle()

      if (existing) {
        setMessage("Ya estás inscrito en este taller 🎨")
        setLoading(false)
        return
      }

      // 📊 comprobar plazas disponibles
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("workshop_id", workshopId)

      if ((count || 0) >= capacity) {
        setMessage("Taller completo ❌")
        setLoading(false)
        return
      }

      // 💾 insertar inscripción
      const { error } = await supabase
        .from("enrollments")
        .insert([
          {
            user_id: user.id,
            workshop_id: workshopId,
          },
        ])

      if (error) {
        console.error("INSERT ERROR:", error)

        if (error.code === "23505") {
          setMessage("Ya estás inscrito en este taller 🎨")
        } else if (error.message.includes("row-level security")) {
          setMessage("Error de permisos")
        } else {
          setMessage("Error al inscribirse")
        }

        setLoading(false)
        return
      }

      setSubmitted(true)

    } catch (err) {
      console.error("UNEXPECTED ERROR:", err)
      setMessage("Error inesperado")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <p className="text-green-600">
        ✅ Inscripción completada
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-lg border space-y-3 max-w-md"
    >
      <h3 className="font-display text-lg">Inscripción</h3>

      {message && (
        <p className="text-sm text-red-500">{message}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 border border-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition disabled:opacity-50"
      >
        {loading ? "Inscribiendo..." : "Confirmar inscripción"}
      </button>
    </form>
  )
}