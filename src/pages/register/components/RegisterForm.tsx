import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormLabel, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

interface IRegisterForm {
    validationSchema: yup.ObjectSchema<any>;
    showPassword: boolean;
    showPasswordConfirm: boolean;
    onSubmitRegister(values: any): Promise<void>;
    handleClickShowPassword: () => void;
    handleMouseDownPassword: () => void;
    handleMouseDownPasswordConfirm: () => void;
    handleClickShowPasswordConfirm: () => void;
}

export default function RegisterForm({
    validationSchema,
    onSubmitRegister,
    showPasswordConfirm,
    handleClickShowPassword,
    handleMouseDownPassword,
    showPassword,
    handleClickShowPasswordConfirm,
    handleMouseDownPasswordConfirm,
}: IRegisterForm) {
    return (
        <Formik
            initialValues={{
                userName: "",
                email: "",
                password: "",
                confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values: any) => {
                onSubmitRegister(values);
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
                            <Typography
                                variant="h2"
                                sx={{
                                    textTransform: "capitalize",
                                }}
                            >
                                Sign Up
                            </Typography>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <FormLabel component={"label"}>Username</FormLabel>
                                <TextField
                                    type="text"
                                    name="userName"
                                    required
                                    value={values.userName}
                                    autoComplete="username"
                                    aria-label="Username"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    size="small"
                                    InputProps={{ color: "secondary" }}
                                    InputLabelProps={{ color: "secondary" }}
                                    // @ts-ignore
                                    helperText={touched["userName"] && errors["userName"]}
                                    error={touched["userName"] && !!errors["userName"]}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <FormLabel component={"label"}>Email</FormLabel>
                                <TextField
                                    type="text"
                                    name="email"
                                    required
                                    value={values.email}
                                    autoComplete="username"
                                    aria-label="Email"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    onChange={handleChange}
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
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
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
                            <Box display={"flex"} flexDirection={"column"} rowGap={1}>
                                <FormLabel component={"label"}>Confirm password</FormLabel>
                                <TextField
                                    type={showPasswordConfirm ? "text" : "password"}
                                    name="confirmPassword"
                                    required
                                    autoComplete="current-password"
                                    aria-label="Confirm password"
                                    hiddenLabel={true}
                                    aria-autocomplete="both"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputProps={{
                                        color: "secondary",
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPasswordConfirm}
                                                    onMouseDown={handleMouseDownPasswordConfirm}
                                                >
                                                    {showPasswordConfirm ? (
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
                                    helperText={touched["confirmPassword"] && errors["confirmPassword"]}
                                    error={touched["confirmPassword"] && !!errors["confirmPassword"]}
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
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                        fontSize: 14,
                                    }}
                                >
                                    Sign Up
                                </Typography>
                            </Button>
                            <Box>
                                <Typography
                                    component={"span"}
                                    style={{
                                        textTransform: "capitalize",
                                        fontSize: 12,
                                    }}
                                >
                                    Already have an account ?
                                </Typography>
                                <Link
                                    style={{
                                        textDecoration: "none",
                                        paddingLeft: 4,
                                        textTransform: "capitalize",
                                    }}
                                    to={"/login"}
                                >
                                    Sign In
                                </Link>
                            </Box>
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
}
