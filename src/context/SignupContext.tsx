/* eslint-disable react-refresh/only-export-components */

import { createContext, useState, useEffect } from "react"

export type Signup = {
  workshopId: string
  name: string
  email: string
}

export type SignupContextType = {
  signups: Signup[]
  addSignup: (signup: Signup) => void
  removeSignup: (workshopId: string, email: string) => void
}

export const SignupContext = createContext<SignupContextType | undefined>(undefined)

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [signups, setSignups] = useState<Signup[]>(() => {
    const stored = localStorage.getItem("signups")
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    localStorage.setItem("signups", JSON.stringify(signups))
  }, [signups])

  const addSignup = (signup: Signup) => {
    setSignups((prev) => [...prev, signup])
  }

  // 🔥 NUEVA FUNCIÓN
  const removeSignup = (workshopId: string, email: string) => {
    setSignups((prev) =>
      prev.filter(
        (s) =>
          !(s.workshopId === workshopId && s.email === email)
      )
    )
  }

  return (
    <SignupContext.Provider value={{ signups, addSignup, removeSignup }}>
      {children}
    </SignupContext.Provider>
  )
}