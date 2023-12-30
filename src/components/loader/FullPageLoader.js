import React from "react";
import "./loader.css";

function FullPageLoader() {
  return (
    <div style={{ height: "100vh" }}>
      <div className="spinner" />
      <h1>Loading...</h1>
    </div>
  );
}

export default FullPageLoader;
