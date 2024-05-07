import React, { useEffect } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SxProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Formik, Form, Field, FormikProps } from "formik";

type FieldConfig = {
    name: string;
    label: string;
    type?: string;
    options?: Array<{ label: string; value: any }>;
};

type ModalProps = {
    open: boolean;
    initialValues?: any;
    fields?: FieldConfig[];
    validationSchema?: any;
    title: string;
    actions?: ActionConfig[];
    formRef?: React.Ref<FormikProps<any>>;
    subTitle?: string;
    onClose?: () => void;
    onDataChange?: (values: any) => void;
    onSave?: (values: any) => void;
};

type ActionConfig = {
    label: string;
    onClick: () => void;
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
};

const Modal: React.FC<ModalProps> = ({
    onClose,
    initialValues,
    fields,
    validationSchema,
    onSave,
    title,
    actions,
    formRef,
    onDataChange,
    subTitle,
}) => {
    return (
        <Dialog open={true} onClose={onClose ? onClose : () => {}} fullWidth>
            <DialogTitle fontSize={"22px"}>
                {title}
                <IconButton
                    style={{ position: "absolute", right: 0, top: 0 }}
                    onClick={onClose ? onClose : () => {}}
                >
                    <CloseIcon color="action" />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <DialogContentText fontSize={"16px"}>{subTitle}</DialogContentText>
                {validationSchema && initialValues && onDataChange ? (
                    <Formik
                        initialValues={initialValues ? initialValues : {}}
                        validationSchema={validationSchema ? validationSchema : {}}
                        onSubmit={(values) => {
                            onSave ? onSave(values) : () => {};
                            onClose ? onClose() : () => {};
                        }}
                        innerRef={formRef ? formRef : null}
                    >
                        {({ errors, touched, values }) => {
                            if (onDataChange) {
                                useEffect(() => {
                                    onDataChange(values);
                                }, [values]);
                            }

                            return (
                                <Form>
                                    <Grid container spacing={4} mt={"15px"}>
                                        {fields &&
                                            fields!.map((field) => (
                                                <Grid item xs={6} key={field.name}>
                                                    {field.type === "select" ? (
                                                        <FormControl fullWidth size="medium">
                                                            <InputLabel id={`${field.name}-label`}>
                                                                {field.label}
                                                            </InputLabel>
                                                            <Field
                                                                name={field.name}
                                                                value={values[field.name]}
                                                                labelId={`${field.name}-label`}
                                                                as={Select}
                                                            >
                                                                {field.options?.map((option) => (
                                                                    <MenuItem
                                                                        key={option.value}
                                                                        value={option.value}
                                                                    >
                                                                        {option.label}
                                                                    </MenuItem>
                                                                ))}
                                                            </Field>
                                                        </FormControl>
                                                    ) : (
                                                        <Field
                                                            as={TextField}
                                                            name={field.name}
                                                            label={field.label}
                                                            fullWidth
                                                            value={values[field.name]}
                                                            size="medium"
                                                            type={field.type || "text"}
                                                            helperText={
                                                                touched[field.name] &&
                                                                errors[field.name]
                                                            }
                                                            error={
                                                                touched[field.name] &&
                                                                !!errors[field.name]
                                                            }
                                                            InputLabelProps={
                                                                field.type === "date"
                                                                    ? {
                                                                          shrink: true,
                                                                      }
                                                                    : undefined
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                            ))}
                                    </Grid>
                                    <DialogActions style={{ marginTop: "15px" }}>
                                        {actions!.map((action, index) => (
                                            <Button
                                                key={index}
                                                onClick={action.onClick}
                                                // @ts-ignore
                                                color={action.color || "secondary"}
                                                variant={action.variant || "text"}
                                                sx={action.sx}
                                                type={action.type}
                                                endIcon={action.icon}
                                            >
                                                {action.label}
                                            </Button>
                                        ))}
                                    </DialogActions>
                                </Form>
                            );
                        }}
                    </Formik>
                ) : (
                    <DialogActions style={{ marginTop: "15px" }}>
                        {actions!.map((action, index) => (
                            <Button
                                key={index}
                                onClick={action.onClick}
                                //@ts-ignore
                                color={action.color || "secondary"}
                                variant={action.variant || "text"}
                                sx={action.sx}
                                type={action.type}
                                endIcon={action.icon}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </DialogActions>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
