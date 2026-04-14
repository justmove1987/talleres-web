import { useState } from "react"
import { supabase } from "../lib/supabase"

type Props = {
  workshopId: string
}

export default function SignupForm({ workshopId }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // 🔐 obtener usuario actual
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      console.log("USER:", user)

      if (userError || !user) {
        setMessage("Debes iniciar sesión")
        setLoading(false)
        return
      }

      const payload = {
        user_id: user.id,
        workshop_id: workshopId,
        email: user.email,
      }

      console.log("INSERT PAYLOAD:", payload)

      // 💾 guardar en base de datos
      const { error } = await supabase
        .from("enrollments")
        .insert([payload])

      if (error) {
        console.error("INSERT ERROR:", error)

        if (error.code === "23505") {
          setMessage("Ya estás inscrito en este taller 🎨")
        } else if (error.message.includes("row-level security")) {
          setMessage("Error de permisos (RLS)")
        } else {
          setMessage(error.message)
        }

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