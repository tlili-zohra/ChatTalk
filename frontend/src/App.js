import "./App.css";
import Register from ".//pages/Register";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthProvider";
import ProtectedRoute from "./components/protectedroute";
import Chatpage from "./pages/chatpage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route // Add this route
          path="/"
          element={
            <ProtectedRoute>
              <Chatpage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-center" />
    </AuthProvider>
  );
}

export default App;
