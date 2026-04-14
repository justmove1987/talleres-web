import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import Footer from "../components/Footer"
import { useAuth } from "../context/useAuth"
import { supabase } from "../lib/supabase"

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const { profile } = useAuth()

  // 🧭 scroll navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 🔐 logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setOpen(false)
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

            {/* 👤 USUARIO */}
            {profile ? (
              <div className="relative">

                {/* botón usuario */}
                <button
                  onClick={() => setOpen((prev) => !prev)}
                  className="flex items-center gap-2"
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                  )}

                  <span className="text-xs normal-case tracking-normal">
                    {profile.name}
                  </span>
                </button>

                {/* dropdown */}
                {open && (
                  <div className="absolute right-0 mt-3 w-44 bg-white text-gray-800 border rounded-xl shadow-lg overflow-hidden text-sm normal-case tracking-normal">

                    <Link
                      to="/perfil"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mi perfil
                    </Link>

                    <Link
                      to="/mis-inscripciones"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Mis talleres
                    </Link>

                    {/* 🔥 SOLO ADMIN */}
                    {profile.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Panel admin
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
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