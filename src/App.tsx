import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import "./App.css";
import pb from "./lib/pocketbase/client";

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!pb.authStore.isValid) {
      navigate('/login')
      return
    }

    navigate('/home')
  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

export default App;
