import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import Footer from "../components/Footer"

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  const [scrolled, setScrolled] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
 type Profile = {
  id: string
  name: string
  avatar_url: string | null
}
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 🔐 cargar usuario + perfil
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

      setProfile(data)
    }

    fetchProfile()

    // escuchar cambios de sesión (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchProfile()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }

  return (
    <div className="min-h-screen flex flex-col font-body">

      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${
          isHome
            ? scrolled
              ? "bg-white text-gray-800 shadow"
              : "text-white"
            : "bg-white text-gray-800 border-b"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="text-3xl font-display tracking-wide">
            Plain Air
          </Link>

          {/* MENU */}
          <div className="flex items-center gap-8 text-sm uppercase tracking-widest">

            <Link to="/" className="hover:opacity-70 transition">
              Plain Air
            </Link>

            <Link to="/talleres" className="hover:opacity-70 transition">
              Talleres
            </Link>

            <Link to="/mis-inscripciones" className="hover:opacity-70 transition">
              Inscripciones
            </Link>

            <Link to="/admin">Admin</Link>

            {/* 👤 USUARIO */}
            {profile ? (
              <div className="flex items-center gap-3">

                {/* avatar */}
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full" />
                )}

                {/* nombre */}
                <span className="text-xs normal-case tracking-normal">
                  {profile.name}
                </span>

                {/* logout */}
                <button
                  onClick={handleLogout}
                  className="text-xs underline hover:opacity-70 normal-case"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="hover:opacity-70 transition">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <main className={`${isHome ? "" : "mt-24"} flex-grow`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}