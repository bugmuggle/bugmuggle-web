import { useEffect } from "react";
import "./App.css";
import pb from "./lib/pocketbase/client";

function App() {
  useEffect(() => {
    if (!pb.authStore.isValid) {
      console.log('not auth')
    }
  }, [])

  return (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  );
}

export default App;
