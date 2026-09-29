import { logout } from "../../features/auth/logout"
import LoadingFull from "../../shared/ui/loader/LoadingFull"

export default function DebugPage() {

  return (
    <>
      <LoadingFull />
      <button onClick={logout}>Logout</button>
    </>
  )
}