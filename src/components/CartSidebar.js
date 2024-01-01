import React, { useEffect } from "react";
import CartItem from "./CartItem";
import Loader from "./loader/Loader";
import { cartUrl, localStorageKey } from "../utils/constant";

function CartSidebar(props) {
  const {
    setShowCart,
    setError,
    isLoggedIn,
    cartProducts,
    setCartProducts,
    isCartLoading,
    setIsCartLoading,
  } = props;

  const storageKey = localStorage.getItem(localStorageKey);

  const calculateTotal = () => {
    return cartProducts
      .reduce(
        (total, productObj) =>
          total + productObj.product.price * productObj.quantity,
        0
      )
      .toFixed(2);
  };

  useEffect(() => {
    setIsCartLoading(true);
    if (isLoggedIn) {
      fetch(`${cartUrl}`, {
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
          setCartProducts(data.cart.items);
          setIsCartLoading(false);
        })
        .catch((errorPromise) => {
          errorPromise.then((errorText) => {
            setError(errorText);
          });
        });
    } else {
      setIsCartLoading(false);
    }
  }, []);

  if (isCartLoading) {
    return (
      <aside className="cart-sidebar">
        <div className="cart-header flex justify-between align-center">
          <h2>My Cart:</h2>
          <button
            className="close-btn"
            type="button"
            onClick={() => {
              setShowCart(false);
            }}
          >
            Close❌
          </button>
        </div>
        <Loader />;
      </aside>
    );
  }

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <aside className="cart-sidebar">
        <div className="cart-header flex justify-between align-center">
          <h2>My Cart:</h2>
          <button
            className="close-btn"
            type="button"
            onClick={() => {
              setShowCart(false);
            }}
          >
            Close❌
          </button>
        </div>
        <h3>Your cart is Empty!</h3>
        <p className="cart-total">Total: $0</p>
      </aside>
    );
  }

  return (
    <aside className="cart-sidebar">
      <div className="cart-header flex justify-between align-center">
        <h2>My Cart:</h2>
        <button
          className="close-btn"
          type="button"
          onClick={() => {
            setShowCart(false);
          }}
        >
          Close❌
        </button>
      </div>
      {cartProducts.map((productObj, index) => (
        <CartItem
          productObj={productObj}
          setCartProducts={setCartProducts}
          setError={setError}
          key={index}
          {...props}
        />
      ))}
      <p className="cart-total">Total: ${calculateTotal()}</p>
    </aside>
  );
}

export default CartSidebar;
