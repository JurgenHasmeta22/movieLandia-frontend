import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface ILoginForm {
    validationSchema: yup.ObjectSchema<any>;
    showPassword: boolean;
    onSubmitLogin(values: any): Promise<void>;
    handleClickShowPassword: () => void;
    handleMouseDownPassword: () => void;
}

export default function LoginForm({
    validationSchema,
    onSubmitLogin,
    handleClickShowPassword,
    handleMouseDownPassword,
    showPassword,
}: ILoginForm) {
    return (
        <Formik
            initialValues={{
                email: "",
                password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values: any) => {
                onSubmitLogin(values);
            }}
            enableReinitialize
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
                return (
                    <Form onSubmit={handleSubmit}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                rowGap: 2,
                            }}
                        >
                            <Typography variant="h2">Sign In</Typography>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <FormLabel component={"label"}>Email</FormLabel>
                                <TextField
                                    type="text"
                                    name="email"
                                    aria-label="Email"
                                    required
                                    value={values.email}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    onBlur={handleBlur}
                                    size="small"
                                    InputProps={{ color: "secondary" }}
                                    InputLabelProps={{ color: "secondary" }}
                                    // @ts-ignore
                                    helperText={touched["email"] && errors["email"]}
                                    error={touched["email"] && !!errors["email"]}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <FormLabel component={"label"}>Password</FormLabel>
                                <TextField
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    autoComplete="current-password"
                                    aria-label="Current password"
                                    aria-autocomplete="both"
                                    hiddenLabel={true}
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        color: "secondary",
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                >
                                                    {showPassword ? (
                                                        <Visibility color="secondary" />
                                                    ) : (
                                                        <VisibilityOff color="secondary" />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    size="small"
                                    InputLabelProps={{ color: "secondary" }}
                                    // @ts-ignore
                                    helperText={touched["password"] && errors["password"]}
                                    error={touched["password"] && !!errors["password"]}
                                />
                            </Box>
                            <Button
                                type="submit"
                                color="secondary"
                                variant="outlined"
                                sx={{
                                    fontWeight: 600,
                                    py: 1,
                                }}
                            >
                                <LockOutlinedIcon />
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: 14,
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Sign In
                                </Typography>
                            </Button>
                            <Box>
                                <Typography
                                    component={"span"}
                                    style={{
                                        fontSize: 12,
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                >
                                    Don't have an account ?
                                </Typography>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                    to={"/register"}
                                >
                                    Sign Up
                                </Link>
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
}
