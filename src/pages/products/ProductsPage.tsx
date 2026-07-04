import { useNavigate } from "react-router"
import { logout } from "../../features/auth/logout"
import MainLayout from "../../shared/ui/layouts/MainLayout"

export default function ProductsPage() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }
  <button onClick={handleLogout}>Logout</button>


  return (
    <MainLayout  userDisplayName="John Doe" onLogout={handleLogout}>
        <div className="md:h-[90vh] md:shadow-[inset_0_8px_20px_8px_rgba(0,0,0,0.2)]">
          <h1>ProductsPage</h1>
        </div>
    </MainLayout>
  )
}


/*
<div className="
      h-screen 
      flex 
      justify-center
      bg-[#f5f5f7] 
      items-center
      md:bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/images/burger-and-fries-background.jpg')]
      bg-cover 
      bg-center
    ">
      <div className="
        flex 
        flex-col 
        h-full 
        w-full 
        bg-gray-600 
        md:h-[95vh] 
        md:max-w-350 
        md:mx-auto
        md:rounded-2xl
      ">
        <div className="
        bg-[#f5f5f7]
          md:rounded-t-2xl
        ">
          <h4>Navbar</h4>
          <button onClick={handleLogout} className="cursor-pointer hover:text-">
            logout
          </button>
        </div>
        <div className="
          flex-1 
          relative 
          bg-[#f5f5f7] 
          pt-[8vh]
          shadow-[inset_0_8px_20px_8px_rgba(0,0,0,0.2)]
          md:pt-0 
          md:rounded-b-2xl
        ">
          <h1>ProductsPage</h1>
        </div>
      </div>
    </div>
 */
