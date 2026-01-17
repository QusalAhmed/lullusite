import React from "react";

const Text = ({text, fontSize}: {text: string; fontSize: number}) => {
    return (
        <div>
            <p style={{fontSize}}>{text}</p>
        </div>
    )
}

export default Text;