import React, { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Button,
    SxProps,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { Formik, FormikProps, Form, Field } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type FieldOption = {
    label: string;
    value: string;
};

type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "select" | "multiselect" | "date" | "password";
    options?: FieldOption[];
    disabled?: boolean;
    span?: number;
    helperText?: React.ReactNode;
    error?: boolean | undefined;
    variant?: any;
    sx?: SxProps;
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
    onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined;
};

type FormProps = {
    initialValues: any;
    validationSchema: yup.ObjectSchema<any>;
    resetTrigger?: boolean;
    fields: FieldConfig[];
    formRef: React.RefObject<FormikProps<any>>;
    actions?: ActionConfig[];
    onDataChange: (values: any) => void;
    onSubmit: (values: any) => void;
    onFormChange?: (values: any, formikHelpers: any) => void;
};

type ActionConfig = {
    label: string;
    type?: string;
    color?:
        | "inherit"
        | "primary"
        | "secondary"
        | "success"
        | "error"
        | "info"
        | "warning"
        | "default";
    variant?: "text" | "outlined" | "contained";
    icon?: React.ReactNode;
    sx?: SxProps;
    onClick?: () => void;
};

const FormAdvanced: React.FC<FormProps> = ({
    initialValues,
    onSubmit,
    validationSchema,
    fields,
    onDataChange,
    formRef,
    actions,
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    return (
        <Formik
            innerRef={formRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
        >
            {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => {
                useEffect(() => {
                    onDataChange(values);
                }, [values]);

                return (
                    <Form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="20px"
                            gridTemplateColumns="repeat(2, minmax(0, 0.5fr))"
                        >
                            {fields.map((field: FieldConfig) => {
                                switch (field.type) {
                                    case "select":
                                        return (
                                            <FormControl fullWidth>
                                                <InputLabel id={`${field.name}-label`}>
                                                    {field.label}
                                                </InputLabel>
                                                <Select
                                                    key={field.name}
                                                    name={field.name}
                                                    labelId={`${field.name}-label`}
                                                    variant={field.variant}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values[field.name]}
                                                    sx={field.sx}
                                                >
                                                    {field.options?.map((option) => (
                                                        <MenuItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        );
                                    case "multiselect":
                                        return (
                                            <FormControl fullWidth>
                                                <InputLabel id={`${field.name}-label`}>
                                                    {field.label}
                                                </InputLabel>
                                                <Select
                                                    key={field.name}
                                                    name={field.name}
                                                    labelId={`${field.name}-label`}
                                                    variant={field.variant}
                                                    fullWidth
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    value={values[field.name]}
                                                    multiple
                                                    sx={field.sx}
                                                >
                                                    {field.options?.map((option) => (
                                                        <MenuItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        );
                                    case "date":
                                        return (
                                            <TextField
                                                key={field.name}
                                                as={TextField}
                                                name={field.name}
                                                label={field.label}
                                                fullWidth
                                                variant={field.variant}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                sx={field.sx}
                                                value={values[field.name]}
                                                type={field.type}
                                                // @ts-ignore
                                                helperText={
                                                    touched[field.name] && errors[field.name]
                                                }
                                                error={touched[field.name] && !!errors[field.name]}
                                                InputLabelProps={
                                                    field.type === "date"
                                                        ? { shrink: true }
                                                        : undefined
                                                }
                                            />
                                        );
                                    case "password":
                                        return (
                                            <TextField
                                                key={field.name}
                                                name={field.name}
                                                label={field.label}
                                                fullWidth
                                                variant={field.variant}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                sx={field.sx}
                                                value={values[field.name]}
                                                type={showPassword ? "text" : "password"}
                                                autoComplete={"on"}
                                                // @ts-ignore
                                                helperText={
                                                    touched[field.name] && errors[field.name]
                                                }
                                                error={touched[field.name] && !!errors[field.name]}
                                                InputLabelProps={{
                                                    style: { color: "#000" },
                                                }}
                                                InputProps={{
                                                    style: { color: "#000" },
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                onMouseDown={
                                                                    handleMouseDownPassword
                                                                }
                                                            >
                                                                {showPassword ? (
                                                                    <Visibility color="primary" />
                                                                ) : (
                                                                    <VisibilityOff color="primary" />
                                                                )}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        );
                                    default:
                                        return (
                                            <TextField
                                                key={field.name}
                                                name={field.name}
                                                type={field.type}
                                                label={field.label}
                                                fullWidth
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                                value={values[field.name]}
                                                variant={field.variant}
                                                disabled={field.disabled}
                                                sx={field.sx}
                                                // @ts-ignore
                                                helperText={
                                                    touched[field.name] && errors[field.name]
                                                }
                                                error={touched[field.name] && !!errors[field.name]}
                                                InputLabelProps={{
                                                    style: { color: "#000" },
                                                }}
                                                InputProps={{
                                                    style: { color: "#000" },
                                                }}
                                            />
                                        );
                                }
                            })}
                        </Box>
                        <Box display="flex" justifyContent="center" mt="20px" gap="20px">
                            {actions!.map((action, index) => (
                                <Button
                                    key={index}
                                    onClick={action.onClick}
                                    // @ts-ignore
                                    color={action.color || "primary"}
                                    variant={action.variant || "text"}
                                    sx={action.sx}
                                    type={action.type}
                                    endIcon={action.icon}
                                >
                                    {action.label}
                                </Button>
                            ))}
                        </Box>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default FormAdvanced;
