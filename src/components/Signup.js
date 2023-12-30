import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usersUrl } from "../utils/constant";
import Loader from "./loader/Loader";
import "../styles/style.css";

function SignupPage(props) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({
    firstname: "",
    email: "",
    password: "",
    username: "",
    other: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value.trim(),
    });
  };

  const validateForm = () => {
    const newErrors = {
      firstname: "",
      email: "",
      password: "",
      username: "",
      other: "",
    };

    if (!formData.firstname) {
      newErrors.firstname = "Firstname can't be empty!";
    }

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (
      !formData.password ||
      formData.password.length < 6 ||
      !/[A-Za-z]/.test(formData.password) ||
      !/\d/.test(formData.password)
    ) {
      newErrors.password =
        "Password must be at least 6 characters long and contain at least one letter and one number";
    }

    if (!formData.username || formData.username.length < 6) {
      newErrors.username = "Username must be at least 6 characters long";
    }

    setErrors(newErrors);

    return !(
      newErrors.firstname ||
      newErrors.email ||
      newErrors.password ||
      newErrors.username
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (isValid) {
      setLoading(true);

      fetch(`${usersUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw response.json();
        })
        .then((data) => {
          navigate("/login");
        })
        .catch((errorPromise) => {
          const errorMessage =
            "An unexpected error occurred. Please try again later.";
          errorPromise.then((errorObj) => {
              setErrors({ ...errors, other: errorObj.message || errorMessage });
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
    <div className="signup-container">
      <h1 className="signup-heading">Signup</h1>
      <form method="post" action="/users" onSubmit={handleSubmit}>
        <div>
          <div className="form-group flex justify-between align-center">
            <div>
              <label htmlFor="firstname">Firstname</label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="Enter your firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label htmlFor="lastname">Lastname</label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Enter your lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
          <span className="error">{errors.firstname}</span>
          <span className="error">{errors.other}</span>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            className="input-field"
          />
          <span className="error">{errors.email}</span>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleInputChange}
            className="input-field"
          />
          <span className="error">{errors.password}</span>
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Create Username"
            value={formData.username}
            onChange={handleInputChange}
            className="input-field"
          />
          <span className="error">{errors.username}</span>
        </div>

        <button type="submit" className="btn-2">
          Signup
        </button>
      </form>

      <p>
        Already have an account?
        <Link to="/login" className="accent">
          {" "}
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default SignupPage;
