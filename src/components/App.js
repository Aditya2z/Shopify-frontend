import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import LoginPage from "./Login";
import SignupPage from "./Signup";
import HomePage from "./HomePage";
import NoMatch from "./NoMatch";
import AlreadyLoggedIn from "./AlreadyAuthenticated";
import FullPageLoader from "./loader/FullPageLoader";
import ErrorPage from "./ErrorPage";
import Footer from "./Footer";
import { userVerifyUrl, localStorageKey } from "../utils/constant";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);

  const storageKey = localStorage.getItem(localStorageKey) || "";

  const updateUser = (data = null) => {
    setIsLoggedIn(!isLoggedIn);
    if (data) {
      const token = data.token || storageKey;
      setUser(data.user);
      localStorage.setItem(localStorageKey, token);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    if (storageKey) {
      fetch(userVerifyUrl, {
        method: "GET",
        headers: {
          Authorization: storageKey,
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw res.json();
        })
        .then((data) => {
          updateUser(data);
          setIsVerifying(false);
        })
        .catch((errorPromise) => {
          errorPromise.then((errorObj) => {
            setError(errorObj);
            setIsVerifying(false);
          });
        });
    } else {
      setIsVerifying(false);
    }
  }, []);

  if (isVerifying) {
    return <FullPageLoader />;
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        user={user}
        setShowCart={setShowCart}
        updateUser={updateUser}
        setIsVerifying={setIsVerifying}
      />
      <Routes>
        <Route
          path="/"
          element={
            error ? (
              <ErrorPage error={error} />
            ) : (
              <HomePage
                setShowCart={setShowCart}
                showCart={showCart}
                setUser={setUser}
                isLoggedIn={isLoggedIn}
              />
            )
          }
        />

        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <AlreadyLoggedIn />
            ) : (
              <LoginPage
                updateUser={updateUser}
                setError={setError}
                isVerifying={isVerifying}
                setIsVerifying={setIsVerifying}
              />
            )
          }
        />
        <Route
          path="/signup"
          element={isLoggedIn ? <AlreadyLoggedIn /> : <SignupPage />}
        />
        <Route path="*" element={<NoMatch />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
