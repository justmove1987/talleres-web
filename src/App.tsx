import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/Home"
import Workshops from "./pages/Workshops"
import WorkshopDetail from "./pages/WorkshopDetail"
import MySignups from "./pages/MySignups"
import Login from "./pages/Login"
import Admin from "./pages/Admin"
import Profile from "./pages/Profile"
import AdminRoute from "./components/AdminRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔹 Layout global */}
        <Route element={<Layout />}>

          {/* 🌐 Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/talleres" element={<Workshops />} />
          <Route path="/talleres/:id" element={<WorkshopDetail />} />

          {/* 🔐 Usuario autenticado (futuro: ProtectedRoute) */}
          <Route path="/mis-inscripciones" element={<MySignups />} />
          <Route path="/perfil" element={<Profile />} />

          {/* 🔑 Auth */}
          <Route path="/login" element={<Login />} />

          {/* 👑 Admin */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />

          {/* ❌ fallback */}
          <Route path="*" element={<Home />} />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App