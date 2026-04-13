import { useState } from "react"
import { supabase } from "../lib/supabase"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (isLogin) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Login correcto ✅")
    }

  } else {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Cuenta creada correctamente ✅")
    }
  }
}

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-display mb-4">
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="border px-4 py-2 rounded-full">
          {isLogin ? "Entrar" : "Crear cuenta"}
        </button>
      </form>

      <button
        className="mt-4 text-sm underline"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "No tienes cuenta? Regístrate"
          : "Ya tienes cuenta? Inicia sesión"}
      </button>
    </div>
  )
}