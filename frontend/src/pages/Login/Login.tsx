import React, { useState } from "react";
import { useLoginMutation } from "../../state/api";
import styles from "./Login.module.scss";
import { useAppDispatch, useAppSelector } from "../../store/redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setIsLoggedIn } from "../../state/globalReducer";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login({ username, password }).unwrap();
      localStorage.setItem("id", `${response.id}`);
      localStorage.setItem("token", response.token);

      dispatch(setIsLoggedIn(true));
      toast.success("You're logged in!", {
        autoClose: 3000,
      });

      navigate("/");
      console.log("User token:", response.token, response.id);
    } catch (err: any) {
      console.log(err.data?.message || "Invalid credentials.");
      toast.error(err.data?.message || "Failed to register.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className={`${styles.loginContainer} ${isDarkMode ? "dark" : "light"}`}
    >
      <form className={`${styles.loginForm} taskCard`} onSubmit={handleSubmit}>
        <img
          src={`${isDarkMode ? "/TaskNest_Dark.png" : "/TaskNest.png"}`}
          alt="Logo"
          className={styles.roundedImage}
        />
        <h2>Login to your account</h2>
        <input
          className="searchInputColor"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="searchInputColor"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <p className={styles.switchPrompt}>
          Don't have an account? <a href="/signUp"> Sign up</a>
        </p>
        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
