import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/style.css";
import { productUrl } from "../utils/constant";
import { localStorageKey } from "../utils/constant";

function Like(props) {
  const { product, isLoggedIn, setError } = props;
  const navigate = useNavigate();

  const storageKey = localStorage.getItem(localStorageKey) || "";
  const { likes, liked, _id } = product;

  const [numberOfLikes, setLikes] = useState(likes);
  const [isLiked, setLiked] = useState(liked);

  useEffect(() => {},[isLoggedIn]);

  const LikeProduct = (productid) => {
    let method = "PUT";
    if (isLiked) {
      method = "DELETE";
    }
    if (isLoggedIn) {
      fetch(`${productUrl}/${productid}/like`, {
        method,
        headers: {
          Authorization: storageKey,
        },
      })
        .then((res) => {
          if (res.ok) {
            setLiked(!isLiked);
            return res.json();
          }
          throw res.json();
        })
        .catch((errorPromise) => {
          errorPromise.then((errorObj) => {
            setError(errorObj);
          });
        });
    }
  };

  return (
    <button
      type="button"
      className={`like flex ${isLiked ? "active" : ""}`}
      onClick={() => {
        if (isLoggedIn) {
          setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
          setLiked(!liked);
          LikeProduct(_id);
        } else {
          navigate("/login");
        }
      }}
    >
      <p>❤&nbsp;</p>
      <p>{numberOfLikes}</p>
    </button>
  );
}

export default Like;
