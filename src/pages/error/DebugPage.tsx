
export default function DebugPage() {

const handleLogout = () => { console.log("handleLogout") }

  return (
    <div>Debug
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
