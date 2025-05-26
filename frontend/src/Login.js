import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState(""); // Add this
  const [password, setPassword] = useState(""); // Add this

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(data);
      setIsAuthenticated(true);
      toast.success(`Welcome! ${data.name}. Please wait...`, {
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      console.log(error.response.data.error);
      setIsAuthenticated(false);
      toast.error(error.response.data.error, {
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });
    }
  };
  const getUserFromLocalStorage = () => {
    const result = localStorage.getItem("user");
    const user = result ? JSON.parse(result) : null;
    return user;
  };
  useEffect(() => {
    if (getUserFromLocalStorage("user")) {
      setIsAuthenticated(true);
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="welcome-container">
      <form className="form" onSubmit={handleLogin}>
        <label htmlFor="email">Provide your email</label>
        <input
          type="email"
          name="email"
          className="input"
          id="email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label htmlFor="password">Enter your password</label>
        <input
          type="password"
          className="input"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn">
          Log In
        </button>

        <Link style={{ paddingTop: "10px" }} to="/register">
          Register
        </Link>
      </form>
    </div>
  );
};
export default Login;
