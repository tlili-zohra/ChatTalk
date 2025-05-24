import { useContext } from "react";

//import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { Navigate } from "react-router-dom";
function ProtectedRoute({ children, ...props }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
    //return <Navigate to="/registre" />;
  }
  return children;
}
export default ProtectedRoute;
