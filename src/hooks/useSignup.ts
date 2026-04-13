import { useContext } from "react"
import { SignupContext } from "../context/SignupContext"

export function useSignup() {
  const context = useContext(SignupContext)

  if (!context) {
    throw new Error("useSignup must be used within SignupProvider")
  }

  return context
}