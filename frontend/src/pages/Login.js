import React, { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState(""); // Add this
  const [password, setPassword] = useState(""); // Add this
  const [showPassword, setShowPassword] = useState(false);

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
      //console.log(data);
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
    <div className="login-container">
      <ToastContainer />
      <form className="login-form" onSubmit={handleLogin}>
        <h2 className="form-title">Welcome Back</h2>

        <input
          type="email"
          id="email"
          className="form-input"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            className="form-input"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="form-button">
          Log In
        </button>

        <p className="form-footer">
          Don’t have an account?{" "}
          <Link to="/register" className="register-link">
            create account
          </Link>
        </p>
      </form>
      <div className="bubbles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
    </div>
  );
};
export default Login;
