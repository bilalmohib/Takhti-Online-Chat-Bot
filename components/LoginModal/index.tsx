'use-client'
import React, { useState } from "react";
import { useRouter } from "next/router";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
    Button,
    Dialog,
    Divider,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";

import Back from "../../public/Images/Login/Back.png";
import Email from "../../public/Images/Login/Email.png";
import Password from "../../public/Images/Login/Password.png";
import Google from "../../public/Images/Login/Google.png";
import Apple from "../../public/Images/Login/Apple.png";

interface LoginModalProps {
    openModal: boolean;
    setOpenModal: (val: boolean) => void;
    // Props for handling social login
    handleLoginWithGoogle: () => void;
    handleLoginWithFacebook: () => void;
    handleLoginWithTwitter: () => void;
    // Props for handling login with email and password
    handleLoginWithEmail: (e: React.FormEvent<HTMLFormElement>) => void;
    email: string;
    setEmail: (val: string) => void;
    password: string;
    setPassword: (val: string) => void;
}
const LoginModal: React.FC<LoginModalProps> = ({
    openModal,
    setOpenModal,
    // Props for handling social login
    handleLoginWithGoogle,
    handleLoginWithFacebook,
    handleLoginWithTwitter,
    // Props for handling login with email and password
    handleLoginWithEmail,
    email,
    setEmail,
    password,
    setPassword
}) => {
    // For navigating to other pages
    const navigate = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    return (
        <Dialog
            fullScreen={true}
            sx={{ backgroundColor: "#DFDFDF" }}
            open={openModal}
            onClose={() => setOpenModal(false)}
        >
            <Box sx={{ paddingX: "24px", border: "1px solid grey" }}>
                <form onSubmit={handleLoginWithEmail}>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            width: "100%",
                            justifyContent: "center",
                            marginBottom: "32px",
                        }}
                    >
                        <Box
                            sx={{
                                marginTop: "8px",
                                width: "40px",
                                height: "40px",
                                border: "1px solid #E8E8E8",
                                borderRadius: "10px",
                                position: "absolute",
                                left: "0",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#fafafa",
                                "&:hover": {
                                    backgroundColor: "#fafafa",
                                },
                            }}
                            onClick={() => setOpenModal(false)}
                        >
                            <Box
                                component="img"
                                sx={{
                                    width: "20px",
                                    height: "20px",
                                }}
                                // @ts-ignore
                                src={Back}
                            />
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{
                                color: "#121212",
                                fontWeight: "700",
                                fontSize: "22px",
                                lineHeight: "32px",
                                letterSpacing: "0.1px",
                                marginTop: "12px",
                            }}
                        >
                            Login
                        </Typography>
                    </Box>

                    <Box sx={{ marginBottom: "16px" }}>
                        <Typography
                            paragraph
                            sx={{
                                fontWeight: "600",
                                fontSize: "14px",
                                lineHeight: "20px",
                                marginBottom: "8px",
                            }}
                        >
                            Email
                        </Typography>
                        <TextField
                            type="email"
                            variant="outlined"
                            required={true}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            fullWidth
                            sx={{
                                fontWeight: "500",
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#121212",
                                "& fieldset": {
                                    borderRadius: "16px",
                                },
                                "& input": {
                                    borderRadius: "0px 16px 16px 0px !important",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            component="img"
                                            // @ts-ignore 
                                            src={Email}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Box sx={{ marginBottom: "16px" }}>
                        <Typography
                            paragraph
                            sx={{
                                fontWeight: "600",
                                fontSize: "14px",
                                lineHeight: "20px",
                                marginBottom: "8px",
                            }}
                        >
                            Password
                        </Typography>
                        <TextField
                            type={showPassword ? "text" : "password"}
                            variant="outlined"
                            required={true}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            sx={{
                                fontWeight: "500",
                                fontSize: "16px",
                                lineHeight: "24px",
                                color: "#121212",
                                "& fieldset": {
                                    borderRadius: "16px",
                                },
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Box
                                            component="img"
                                            // @ts-ignore
                                            src={Password}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <VisibilityOff sx={{ color: "#B8B8B8" }} />
                                            ) : (
                                                <Visibility sx={{ color: "#B8B8B8" }} />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Typography
                        // onClick={() => navigate("/forgot-password")}
                        onClick={() => alert("Coming soon...")}
                        paragraph
                        sx={{
                            fontWeight: "500",
                            fontSize: "14px",
                            lineHeight: "20px",
                            color: "#3865F3",
                            textAlign: "right",
                            marginBottom: "32px",
                        }}
                    >
                        Forgot password
                    </Typography>
                    <Button
                        // type="submit"
                        variant="contained"
                        fullWidth
                    // sx={{
                    //     background: "blue",
                    //     fontWeight: "600",
                    //     fontSize: "16px",
                    //     lineHeight: "24px",
                    //     paddingY: "16px",
                    //     marginBottom: "32px",
                    //     borderRadius: "16px",
                    //     textTransform: "none",
                    //     "&:hover": {
                    //         backgroundColor: "#294ec4",
                    //     },
                    // }}
                    >
                        Login
                    </Button>
                    <Button variant="contained">Contained</Button>
                    <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: "48px",
                        }}
                    >
                        <Divider
                            sx={{
                                borderTop: "1px solid #E8E8E8",
                                position: "absolute",
                                top: "50%",
                                left: "0",
                                width: "100%",
                                zIndex: "2",
                            }}
                        />
                        <Box
                            sx={{
                                width: "30px",
                                position: "relative",
                                zIndex: "3",
                                backgroundColor: "white",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                paragraph
                                sx={{
                                    fontWeight: "500",
                                    fontSize: "12px",
                                    lineHeight: "20px",
                                    textAlign: "center",
                                    marginBottom: "0",
                                    color: "#B8B8B8",
                                }}
                            >
                                OR
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        onClick={() => handleLoginWithGoogle()}
                        variant="outlined"
                        startIcon={<Box
                            component="img"
                            // @ts-ignore 
                            src={Google} />}
                        fullWidth
                        sx={{
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "24px",
                            paddingY: "16px",
                            marginBottom: "32px",
                            borderRadius: "16px",
                            border: "1px solid #E5EBF0",
                            textTransform: "none",
                            "& .MuiButton-startIcon": {
                                position: "absolute",
                                left: "24px",
                                top: "20px",
                            },
                        }}
                    >
                        Login with Google
                    </Button>
                    {/* <Button
                        variant="outlined"
                        startIcon={<Box
                            component="img"
                            // @ts-ignore
                            src={Apple}
                        />}
                        fullWidth
                        sx={{
                            fontWeight: "600",
                            fontSize: "16px",
                            lineHeight: "24px",
                            paddingY: "16px",
                            marginBottom: "10px",
                            borderRadius: "16px",
                            border: "1px solid #E5EBF0",
                            textTransform: "none",
                            "& .MuiButton-startIcon": {
                                position: "absolute",
                                left: "24px",
                                top: "18px",
                            },
                        }}
                    >
                        Login with Apple
                    </Button> */}
                    <Typography
                        paragraph
                        sx={{
                            fontWeight: "400",
                            fontSize: "14px",
                            lineHeight: "20px",
                            textAlign: "center",
                        }}
                    >
                        Don’t have an account?{" "}
                        <Box
                            onClick={() => navigate.push("/signup")}
                            component="span"
                            sx={{ color: "#5C68FF", fontWeight: "600", cursor: "pointer" }}
                        >
                            Sign Up
                        </Box>
                    </Typography>
                </form>
            </Box>
        </Dialog>
    );
};

export default LoginModal;