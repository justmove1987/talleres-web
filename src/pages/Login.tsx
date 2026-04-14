import { useState, useEffect, useRef } from "react"
import { supabase } from "../lib/supabase"
import { useNavigate } from "react-router-dom"

// 🔐 Tipado Turnstile
interface Turnstile {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
    }
  ) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState("")

  const [file, setFile] = useState<File | null>(null)

  const preview = file ? URL.createObjectURL(file) : null

  const captchaRef = useRef<HTMLDivElement>(null)
  const captchaRendered = useRef(false)

  // 🧹 limpiar preview
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  // 🔐 Render captcha
  useEffect(() => {
    if (
      captchaRendered.current ||
      !captchaRef.current ||
      !window.turnstile
    ) return

    captchaRendered.current = true

    window.turnstile.render(captchaRef.current, {
      sitekey: "0x4AAAAAAC9MXK4yuHZMn_On",
      callback: (token: string) => {
        setCaptchaToken(token)
      },
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (!captchaToken) {
      setMessage("Completa el captcha")
      setLoading(false)
      return
    }

    // 🔐 LOGIN
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      // 👉 redirigir
      navigate("/")
      return
    }

    // 📝 REGISTER
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      setMessage(error?.message || "Error al registrarse")
      setLoading(false)
      return
    }

    let avatarPublicUrl: string | null = null

    // 🖼 subir avatar (opcional)
    if (file) {
      const fileExt = file.name.split(".").pop()
      const fileName = `${data.user.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true })

      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName)

        avatarPublicUrl = publicUrlData.publicUrl
      }
    }

    // 👉 crear perfil (IMPORTANTE)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: data.user.id,
          name: name || "Usuario",
          avatar_url: avatarPublicUrl, // ✅ null permitido
          role: "user",
        },
      ])

    if (profileError) {
      console.error("PROFILE ERROR:", profileError)
      setMessage("Error creando perfil")
      setLoading(false)
      return
    }

    setMessage("Cuenta creada correctamente ✅")

    // 👉 opcional: redirigir tras registro
    navigate("/")

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-display mb-4">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* REGISTRO */}
        {!isLogin && (
          <>
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div>
              <label className="text-sm block mb-1">
                Avatar (opcional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setFile(e.target.files[0])
                  }
                }}
              />

              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="mt-2 w-16 h-16 rounded-full object-cover"
                />
              )}
            </div>
          </>
        )}

        {/* EMAIL */}
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* RECORDAR */}
        <label className="text-sm flex items-center gap-2">
          <input type="checkbox" />
          Recordarme
        </label>

        {/* CAPTCHA */}
        <div ref={captchaRef} />

        {/* MENSAJE */}
        {message && (
          <p className="text-sm text-red-500">{message}</p>
        )}

        {/* BOTÓN */}
        <button
          disabled={loading}
          className="border px-4 py-2 rounded-full w-full hover:bg-gray-100 transition disabled:opacity-50"
        >
          {loading
            ? "Procesando..."
            : isLogin
            ? "Entrar"
            : "Crear cuenta"}
        </button>
      </form>

      {/* SWITCH */}
      <button
        className="mt-4 text-sm underline"
        onClick={() => {
          setIsLogin(!isLogin)
          setMessage("")
        }}
      >
        {isLogin
          ? "No tienes cuenta? Regístrate"
          : "Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  )
}