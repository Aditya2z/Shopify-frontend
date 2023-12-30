import React from "react";
import { localStorageKey } from "../utils/constant";

function CartItem(props) {
  const { setShowCart, productObj, setCartProducts, setError } = props;
  const storageKey = localStorage.getItem(localStorageKey);

  // Function to increase the quantity of a product in the user's cart
  const increaseQuantity = (productId) => {
    return fetch(`/api/cart/increase/${productId}`, {
      method: "PUT",
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
      })
      .catch((errorPromise) => {
        errorPromise.then((errorText) => {
          setError(errorText);
        });
      });
  };

  // Function to decrease the quantity of a product in the user's cart
  const decreaseQuantity = (productId) => {
    return fetch(`/api/cart/decrease/${productId}`, {
      method: "PUT",
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
      })
      .catch((errorPromise) => {
        errorPromise.then((errorText) => {
          setError(errorText);
        });
      });
  };

  // Function to remove an item from the user's cart
  const removeFromCart = (productId) => {
    return fetch(`/api/cart/${productId}`, {
      method: "DELETE",
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
      })
      .catch((errorPromise) => {
        console.log(errorPromise);
        errorPromise.then((errorObj) => {
          setError(errorObj);
        });
      });
  };

  if (!productObj) {
    return (
      <>
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
        <h2>Your Cart is Empty</h2>
      </>
    );
  }

  const { product, quantity } = productObj;
  const { name, _id, price, image_url } = product;

  return (
    <div className="cart-item">
      <div className="cart-item-control">
        <button
          className="close-btn"
          type="button"
          onClick={() => {
            removeFromCart(_id);
          }}
        >
          Remove Item❌
        </button>
      </div>
      <div className="flex justify-between align-center">
        <figure className="flex-20">
          <img src={image_url} alt={name} />
        </figure>
        <h4 className="flex-32">{name}</h4>
        <div className="quantity-control flex justify-between align-center flex-20">
          <button
            className="quantity-btn"
            onClick={() => {
              if (quantity > 1) {
                decreaseQuantity(_id);
              } else {
                removeFromCart(_id);
              }
            }}
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            className="quantity-btn"
            onClick={() => increaseQuantity(_id)}
          >
            +
          </button>
        </div>
        <div className="product-price flex-20">
          <p className="small-text">
            ${price} * {quantity} ={" "}
          </p>
          <h3>${(price * quantity).toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
