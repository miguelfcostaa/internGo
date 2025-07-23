import React from "react";

const Label = ({ text, ClassName }) => {
    return (
        <label className={ClassName}>
            {text}
        </label>
    );
};

export default Label;
