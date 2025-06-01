import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { AuthContext } from "./Context/AuthProvider";

const Register = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(AuthContext);
  const [name, setName] = useState(""); // Add this
  const [email, setEmail] = useState(""); // Add this
  const [password, setPassword] = useState(""); // Add this
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_URL}/auth/register`,
        {
          name,
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
      toast.success("Success!", {
        duration: 5000,
        isClosable: true,
        position: "top-center",
      });

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.error);
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
    <div className="register-page">
      <form className="register-form" onSubmit={handleRegister}>
        <h2 className="form-title">Register</h2>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="register-input"
          placeholder="Your full name"
        />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="register-input"
          placeholder="Your email address"
        />
        <div className="password-field">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
            placeholder="Create a password"
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="register-buttons">
          <button type="submit" className="btn-register">
            Register
          </button>
          <button
            type="button"
            className="btn-login"
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>
      </form>

      <div className="bubbles">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
    </div>
  );
};
export default Register;
