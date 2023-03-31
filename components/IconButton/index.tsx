/* eslint-disable @next/next/no-img-element */
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
            {/* // eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={icon}
                alt="icon"
            />
        </Button>
    );
};

export default CustomIconButton;