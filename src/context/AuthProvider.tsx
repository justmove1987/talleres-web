import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "../lib/supabase"
import { AuthContext } from "./AuthContext"

type Profile = {
  id: string
  name: string
  avatar_url: string | null
  role?: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    setProfile(data)
  }

  const refreshProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setUser(user)

    if (user) {
      await fetchProfile(user.id)
    } else {
      setProfile(null)
    }
  }

  useEffect(() => {
    const init = async () => {
      await refreshProfile()
    }

    init()

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      refreshProfile()
    })

    return () => {
      listener.subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AuthContext.Provider value={{ user, profile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}