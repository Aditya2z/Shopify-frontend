import React, { useEffect, useState } from "react";
import { cartUrl, localStorageKey } from "../utils/constant";

function CartItem(props) {
  const [productQuantity, setQuantity] = useState(0);

  const {
    setShowCart,
    productObj,
    setCartProducts,
    setError,
    setIsCartLoading,
  } = props;
  const storageKey = localStorage.getItem(localStorageKey);

  const increaseQuantity = (productId) => {
    setQuantity((prevProductQuantity) => prevProductQuantity + 1);
    return fetch(`${cartUrl}/increase/${productId}`, {
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

  const decreaseQuantity = (productId) => {
    setQuantity((prevProductQuantity) => prevProductQuantity - 1);
    return fetch(`${cartUrl}/decrease/${productId}`, {
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

  const removeFromCart = (productId) => {
    setIsCartLoading(true);
    fetch(`${cartUrl}/${productId}`, {
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
        setIsCartLoading(false);
      })
      .catch((errorPromise) => {
        setIsCartLoading(false);
        errorPromise.then((errorObj) => {
          setError(errorObj);
        });
      });
  };

  useEffect(() => {
    setQuantity(quantity);
  }, []);

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
          <p>{productQuantity}</p>
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
