import React from "react";

function ErrorPage(props) {
  const { error } = props;

  return <h1 className="container-90">{error.message}</h1>;
}

export default ErrorPage;
