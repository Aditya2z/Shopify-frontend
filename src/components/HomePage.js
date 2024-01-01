import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import FullPageLoader from "./loader/FullPageLoader";
import ErrorPage from "./ErrorPage";
import CartSidebar from "./CartSidebar";
import "../styles/style.css";
import { productUrl, localStorageKey } from "../utils/constant";

function HomePage(props) {
  const { setShowCart, showCart, isLoggedIn } = props;
  const [products, setProducts] = useState(null);
  const [cartProducts, setCartProducts] = useState(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const storageKey = localStorage.getItem(localStorageKey) || "";

  const fetchProducts = () => {
    fetch(productUrl, {
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
        setProducts(data.products);
        setIsVerifying(false);
      })
      .catch((errorPromise) => {
        // Check if the error is a response object
        if (error instanceof Response) {
          error.json().then((errorObj) => {
            setError(errorObj);
          });
        } else {
          // If it's not a response object, handle the error accordingly
          setError({ message: "Network error or server unreachable" });
        }
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (error) {
    return <ErrorPage error={error} />;
  }

  if (isVerifying || !products) {
    return <FullPageLoader />;
  }

  return (
    <div className="product-list flex wrap container-90">
      {products &&
        products.map((product) => {
          return (
            <ProductCard
              key={product._id}
              product={product}
              setShowCart={setShowCart}
              showCart={showCart}
              setError={setError}
              setCartProducts={setCartProducts}
              isLoggedIn={isLoggedIn}
              setIsCartLoading={setIsCartLoading}
            />
          );
        })}
      {showCart && (
        <CartSidebar
          setShowCart={setShowCart}
          setError={setError}
          isLoggedIn={isLoggedIn}
          cartProducts={cartProducts}
          setCartProducts={setCartProducts}
          isCartLoading={isCartLoading}
          setIsCartLoading={setIsCartLoading}
        />
      )}
    </div>
  );
}

export default HomePage;
