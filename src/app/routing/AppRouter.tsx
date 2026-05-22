import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import LoginPage from "../../pages/auth/login/LoginPage";
import NotFoundPage from "../../pages/error/NotFoundPage";
import DebugPage from "../../pages/error/DebugPage";
import { useAuth } from "../providers/AuthProvider";

export default function AppRouter() {

  const { user } = useAuth()


  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Navigate to={user ? "/debug" : "/login"} />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/debug" element={<DebugPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
  )
}
