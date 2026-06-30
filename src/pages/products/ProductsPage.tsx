import { useNavigate } from "react-router"
import { logout } from "../../features/auth/logout"

export default function ProductsPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div>ProductsPage
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}