import React from "react";

function Footer() {
    return (
    <footer className="footer">
        <div className="container-90">
            <p>Shopify &copy; {new Date().getFullYear()}</p>
        </div>
    </footer>
    );
}

export default Footer;