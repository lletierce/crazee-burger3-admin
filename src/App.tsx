import { AuthProvider } from "./app/providers/AuthProvider"
import AppRouter from "./app/routing/AppRouter"

function App() {

  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App