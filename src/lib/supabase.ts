import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://aejwanfijifkjwmuwyua.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlandhbmZpamlma2p3bXV3eXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTY3MDEsImV4cCI6MjA5MTY3MjcwMX0.iPqB1L0ceGETZatupwV94JpWmfqwyuzSnX972Ik6yLM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)