/* eslint-disable @next/next/no-img-element */
'use-client'
import React from "react";

import { Button } from "@mui/material";

interface CustomButtonProps {
    icon: string;
    InputStyles: {};
    onClick: () => void;
}
const CustomIconButton: React.FC<CustomButtonProps> = ({
    icon,
    InputStyles,
    onClick
}) => {
    return (
        <Button onClick={onClick} sx={InputStyles} color="info">
            <p>
                <img
                    src={icon}
                    alt="icon"
                />
            </p>
            <h3 style={{ marginLeft: "20px", color: "black" }}>Continue With Google</h3>
        </Button>
    );
};

export default CustomIconButton;