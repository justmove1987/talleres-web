import { Link, Outlet, useLocation } from "react-router-dom"
import { useEffect, useState } from "react"
import Footer from "../components/Footer"

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === "/"

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
          <div className="flex gap-8 text-sm uppercase tracking-widest">
            <Link to="/" className="hover:opacity-70 transition">
              Plain Air
            </Link>

            <Link to="/talleres" className="hover:opacity-70 transition">
              Talleres
            </Link>

            <Link to="/mis-inscripciones" className="hover:opacity-70 transition">
              Inscripciones
            </Link>
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