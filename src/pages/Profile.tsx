import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"

type Profile = {
  id: string
  name: string
  avatar_url: string | null
  role?: string
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ preview derivado
  const preview = file ? URL.createObjectURL(file) : null

  // 🧹 limpiar memoria
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // 🔐 cargar perfil
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile(data)
        setName(data.name)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setMessage("")

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setMessage("No autenticado")
      setLoading(false)
      return
    }

    let avatarUrl = profile?.avatar_url || ""

    // 🔥 subir nueva imagen
    if (file) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true })

      if (!uploadError) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName)

        avatarUrl = data.publicUrl
      }
    }

    // 💾 update perfil
    const { error } = await supabase
      .from("profiles")
      .update({
        name,
        avatar_url: avatarUrl,
      })
      .eq("id", user.id)

    if (error) {
      setMessage("Error al guardar")
    } else {
      setMessage("Perfil actualizado ✅")

      // 🔄 actualizar estado local
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              name,
              avatar_url: avatarUrl,
            }
          : prev
      )
    }

    setLoading(false)
  }

  if (!profile) {
    return <p className="mt-20 text-center">Cargando perfil...</p>
  }

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4">
      <h1 className="text-2xl font-display">Mi perfil</h1>

      {/* Avatar */}
      <div>
        <p className="text-sm mb-1">Avatar</p>

        <img
          src={preview || profile.avatar_url || "/placeholder.png"}
          className="w-20 h-20 rounded-full object-cover mb-2"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0])
            }
          }}
        />
      </div>

      {/* Nombre */}
      <div>
        <p className="text-sm mb-1">Nombre</p>
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Mensaje */}
      {message && (
        <p className="text-sm text-green-600">{message}</p>
      )}

      {/* Botón */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="border px-4 py-2 rounded-full w-full hover:bg-gray-100 transition disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  )
}