import React, { useState } from "react";
import Like from "./Like";
import { localStorageKey, cartUrl } from "../utils/constant";
import { useNavigate } from "react-router-dom";

function ProductCard(props) {
  const {
    product,
    setShowCart,
    setError,
    setCartProducts,
    isLoggedIn,
    setIsCartLoading,
  } = props;

  const storageKey = localStorage.getItem(localStorageKey) || "";
  const navigate = useNavigate();

  // Function to add a product to the user's cart
  const addToCart = (productId) => {
    setIsCartLoading(true);
    if (isLoggedIn) {
      setShowCart(true);
      fetch(`${cartUrl}/${productId}`, {
        method: "POST",
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
          setCartProducts(data.cart.items);
          setIsCartLoading(false);
        })
        .catch((errorPromise) => {
          errorPromise.then((errorObj) => {
            setError(errorObj);
          });
          setIsCartLoading(false);
        });
    } else {
      setIsCartLoading(false);
      navigate("/login");
    }
  };

  return (
    <>
      <div className="product-card">
        <figure>
          <img src={product.image_url} alt={product.name} />
          <p className="likes">
            <Like
              product={product}
              isLoggedIn={isLoggedIn}
              setError={setError}
            />
          </p>
        </figure>
        <div className="product-details">
          <div className="flex justify-between align-center product-heading">
            <h4>{product.name}</h4>
            <h3>${product.price}</h3>
          </div>
          <p>{product.description}</p>
        </div>
        <button
          type="button"
          className="btn-2"
          onClick={(event) => {
            addToCart(product._id);
          }}
        >
          🛒 Add to cart
        </button>
      </div>
    </>
  );
}

export default ProductCard;
