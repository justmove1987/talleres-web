import { Navigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}

export default function AdminRoute({ children }: Props) {
  const { profile } = useAuth()

  // 🔐 aún cargando
  if (!profile) {
    return null // o spinner si quieres
  }

  // 🚫 no admin → redirigir a login (mejora UX)
  if (profile.role !== "admin") {
    return <Navigate to="/login" />
  }

  return <>{children}</>
}