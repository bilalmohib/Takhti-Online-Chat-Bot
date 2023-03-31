import React, { ReactNode } from "react";

import { Box, InputAdornment, TextField, useMediaQuery } from "@mui/material";

import theme from "../../theme";

interface CustomInputProps {
    placeHolder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    type: string;
    Icon: ReactNode;
    InputStyles: {};
    endElement?: any;
    id?: string;
}
const CustomInput: React.FC<CustomInputProps> = (props) => {
    const {
        placeHolder,
        Icon,
        InputStyles,
        endElement,
        type,
        required,
        value,
        onChange,
        id
    } = props;
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box sx={InputStyles}>
            <TextField
                type={type}
                id={id}
                placeholder={placeHolder}
                required={required}
                value={value}
                onChange={onChange}
                size={isMobile ? "small" : "medium"}
                sx={{
                    // border: "1px solid black",
                    width: 1,
                    "& label": { display: "none" },
                    "& input": {
                        fontStyle: "normal",
                        fontWeight: "400",
                        fontSize: { sm: "18px", xs: "14px" },
                        lineHeight: { sm: "27px", xs: "18px" },
                        letterSpacing: "0.02em",
                        color: "#94959B",
                        height: { sm: "unset", xs: "30px" },
                    },
                    "& fieldset": {
                        // paddingLeft: (theme) => theme.spacing(2.5),
                        borderRadius: "12px",
                    },
                    "& .MuiOutlinedInput-root:hover": {
                        "& > fieldset": {
                            borderColor: "#556cd6",
                        },
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment
                            sx={{ color: "#94959B", width: { sm: "25px", xs: "25px" } }}
                            position="start"
                        >
                            {Icon}
                        </InputAdornment>
                    ),
                    endAdornment: endElement && (
                        <InputAdornment position="end">{endElement}</InputAdornment>
                    ),
                }}
                variant="outlined"
            />
        </Box>
    );
};
export default CustomInput;