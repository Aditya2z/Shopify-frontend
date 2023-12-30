import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { localStorageKey } from "../utils/constant";
import "../styles/style.css";

function Header(props) {
  const { isLoggedIn, updateUser, user, setShowCart } = props;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(localStorageKey);
    updateUser(null);
    navigate(0);
  };

  return (
    <header className="flex justify-between align-center">
      <a href="/" className="brand">
        Shopify
      </a>
      <nav>
        <ul className="nav-menu flex justify-between align-center">
          {isLoggedIn ? (
            <AuthHeader
              handleLogout={handleLogout}
              user={user}
              setShowCart={setShowCart}
            />
          ) : (
            <NonAuthHeader />
          )}
        </ul>
      </nav>
    </header>
  );
}

function NonAuthHeader() {
  return (
    <>
      <li>
        <NavLink className="nav-menu-item" activeclassname="active" to="/login">
          Sign in
        </NavLink>
      </li>
      <li>
        <NavLink
          className="nav-menu-item"
          activeclassname="active"
          to="/signup"
        >
          Sign up
        </NavLink>
      </li>
    </>
  );
}

function AuthHeader(props) {
  const { user, setShowCart, handleLogout } = props;

  return (
    <>
      <li>
        <Link
          className="nav-menu-item"
          to="/"
          onClick={() => {
            setShowCart(true);
          }}
        >
          🛒My Cart
        </Link>
      </li>
      <li>
        <Link
          className="nav-menu-item flex align-center"
          to={`/`}
        >
          {user.name}
        </Link>
      </li>
      <li>
        <button
          type="button"
          className="btn-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </li>
    </>
  );
}

export default Header;
