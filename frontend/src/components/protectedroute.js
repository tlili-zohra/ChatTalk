import { useContext } from "react";

//import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
function ProtectedRoute({ children, ...props }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return;
  }
  return children;
}
export default ProtectedRoute;
