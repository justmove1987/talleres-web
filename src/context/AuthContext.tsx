import { createContext } from "react"

export type Profile = {
  id: string
  name: string
  avatar_url: string | null
  role?: string
}

export type AuthContextType = {
  profile: Profile | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  profile: null,
  loading: true,
})