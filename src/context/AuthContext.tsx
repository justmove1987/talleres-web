import { createContext } from "react"
import type { User } from "@supabase/supabase-js"

type Profile = {
  id: string
  name: string
  avatar_url: string | null
  role?: string
}

export type AuthContextType = {
  user: User | null
  profile: Profile | null
  refreshProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)