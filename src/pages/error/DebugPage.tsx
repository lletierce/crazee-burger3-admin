import { useNavigate } from "react-router"
import { logout } from "../../features/auth/logout"

export default function DebugPage() {

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    console.log('success - logout')
  }

  return (
    <div>Debug
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}