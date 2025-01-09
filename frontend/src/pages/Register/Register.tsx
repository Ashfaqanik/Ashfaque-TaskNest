import React, { useState } from "react";
import { useCreateUserMutation } from "../../state/api";
import styles from "./Register.module.scss";
import { useAppSelector } from "../../store/redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teamId, setTeamId] = useState("");
  const [role, setRole] = useState("");

  const [createUser, { isLoading }] = useCreateUserMutation();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser({
        username,
        email,
        image: "",
        password,
        teamId: teamId ? parseInt(teamId) : undefined,
        role,
      }).unwrap();
      toast.success("Registration successful!", {
        autoClose: 3000,
      });
      navigate("/login");
    } catch (err: any) {
      console.log(err.data?.message || "Failed to register. Please try again.");
      toast.error(err.data?.message || "Failed to register.", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div
      className={`${styles.signUpContainer} ${isDarkMode ? "dark" : "light"}`}
    >
      <form className={`${styles.signUpForm} taskCard`} onSubmit={handleSubmit}>
        <img
          src={`${isDarkMode ? "/TaskNest_Dark.png" : "/TaskNest.png"}`}
          alt="Logo"
          className={styles.roundedImage}
        />
        <h2>Sign up to create your account</h2>
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <input
          className="searchInputColor"
          type="text"
          placeholder="Team ID (Optional)"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <input
          className="searchInputColor"
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <p className={styles.switchPrompt}>
          Already have an account? <Link to="/login"> Sign In</Link>
        </p>
        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
