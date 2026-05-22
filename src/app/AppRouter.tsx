import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "../pages/auth/login/LoginPage";
import NotFoundPage from "../pages/error/NotFoundPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    </BrowserRouter>
  )
}
