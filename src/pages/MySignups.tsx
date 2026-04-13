import { useSignup } from "../hooks/useSignup"
import { workshops } from "../data/workshops"

export default function MySignups() {
  const { signups, removeSignup } = useSignup()

  if (signups.length === 0) {
    return <p>No tienes inscripciones aún</p>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Mis inscripciones
      </h1>

      <div className="space-y-4">
        {signups.map((signup, index) => {
          const workshop = workshops.find(
            (w) => w.id === signup.workshopId
          )

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl border shadow-sm"
            >
              <h2 className="font-semibold">
                {workshop?.title}
              </h2>

              <p className="text-sm text-gray-500">
                📅 {workshop?.date}
              </p>

              <p className="text-sm mt-2">
                {signup.name} - {signup.email}
              </p>

              <button
                onClick={() =>
                    removeSignup(signup.workshopId, signup.email)
                }
                className="mt-3 text-red-600 hover:text-red-800 text-sm"
                >
                Cancelar inscripción
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}