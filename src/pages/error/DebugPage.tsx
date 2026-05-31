import { useNavigate } from "react-router"
import { logout } from "../../features/auth/logout"
import LoadingFull from "../../shared/ui/loader/LoadingFull"

export default function DebugPage() {

  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <LoadingFull />
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}