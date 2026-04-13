import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

type Props = {
  workshopId: string
}

export default function SignupForm({ workshopId }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const { addSignup, signups } = useSignup()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const alreadySigned = signups.some(
      (s) =>
        s.workshopId === workshopId &&
        s.email.toLowerCase() === email.toLowerCase()
    )

    if (alreadySigned) {
      setError("Este email ya está inscrito en este taller")
      return
    }

    setError("")

    addSignup({
      workshopId,
      name,
      email,
    })

    setSubmitted(true)
  }

  if (submitted) {
    return <p className="text-green-600">✅ Inscripción completada</p>
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded-lg border space-y-3 max-w-md"
    >
      <h3 className="font-semibold">Inscripción</h3>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <input
        className="w-full p-2 border rounded"
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        className="w-full p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button className="mt-4 border border-gray-800 px-4 py-2 rounded-full text-sm hover:bg-gray-100 transition">
        Enviar
      </button>
    </form>
  )
}