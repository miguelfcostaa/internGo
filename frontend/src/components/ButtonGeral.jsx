import React from "react";

function ButtonGeral({ Name, className, location}) {
    return (
        <button  className={className} >{Name}</button>
    );
}
           {/* onClick={() => navigate("/select-user")} */}
export default ButtonGeral;
