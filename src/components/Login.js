import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usersUrl } from "../utils/constant";
import Loader from "./loader/Loader";
import "../styles/style.css";

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [otherError, setOtherError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser, setError } = props;
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const validateForm = () => {
    switch (true) {
      case !email:
        setEmailError("Email field cannot be empty");
        break;
      case !email.includes("@"):
        setEmailError("Invalid email address");
        break;
      default:
        break;
    }

    switch (true) {
      case !password:
        setPasswordError("Password field cannot be empty");
        break;
      case password.length < 6:
        setPasswordError("Password must be at least 6 characters long");
        break;
      case !/[A-Za-z]/.test(password) || !/\d/.test(password):
        setPasswordError("Password must contain at least one letter and one number");
        break;
      default:
        break;
    }

    setEmailError(emailError);
    setPasswordError(passwordError);

    return !(emailError || passwordError);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      setLoading(true);

      fetch(`${usersUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response.json();
        })
        .then((data) => {
          setError(null);
          updateUser(data);
          navigate("/");
        })
        .catch((errorPromise) => {
          errorPromise.then((errorObj) => {
            setOtherError(errorObj.message);
        });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login-container">
      <h1 className="login-heading">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleInputChange}
            className="input-field"
          />
          <span className="error">{emailError}</span>
          <span className="error">{otherError}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={handleInputChange}
            className="input-field"
          />
          <span className="error">{passwordError}</span>
        </div>

        <button type="submit" className="btn-2">
          Login
        </button>
      </form>

      <p>
        Don't have an account?
        <Link to="/signup" className="accent">
          {" "}
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
