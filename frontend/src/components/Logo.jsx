import React from "react";
import logo from "../assets/logo.png";

function Logo({ width, height }) {
    return (
        <div>
            <a href="/home">
                <img src={logo} alt="Logo" width={width} height={height} />
            </a>
        </div>
    );
}

export default Logo;
