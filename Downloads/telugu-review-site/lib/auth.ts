const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Simple auth for demo - in production use proper authentication
const ADMIN_CREDENTIALS = {
  email: "admin@reviewhub.com",
  password: "admin123",
}

export const checkAdminAuth = (email: string, password: string): boolean => {
  return email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password
}

export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false
  return localStorage.getItem("admin_authenticated") === "true"
}

export const login = (email: string, password: string): boolean => {
  if (checkAdminAuth(email, password)) {
    localStorage.setItem("admin_authenticated", "true")
    return true
  }
  return false
}

export const logout = (): void => {
  localStorage.removeItem("admin_authenticated")
}
