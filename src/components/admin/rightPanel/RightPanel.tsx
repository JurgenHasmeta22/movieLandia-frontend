import React, { useEffect, useState } from "react";
import {
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Drawer,
    Box,
    Typography,
    Step,
    StepLabel,
    Stepper,
    StepButton,
    useTheme,
    IconButton,
    SxProps,
} from "@mui/material";
import { Formik, Form, Field, FormikProps } from "formik";
import CloseIcon from "@mui/icons-material/Close";

type FieldConfig = {
    name: string;
    label: string;
    type?: string;
    options?: Array<{ label: string; value: any }>;
    variant?: string;
    disabled?: boolean;
    sx: {
        gridColumn: string;
    };
};

type DrawerProps = {
    onClose?: () => void;
    onSave?: (values: any) => void;
    onDataChange?: (values: any) => void;
    initialValues?: any;
    fields?: FieldConfig[];
    validationSchema?: any;
    title?: string;
    actions?: ActionConfig[];
    formRef?: React.Ref<FormikProps<any>>;
    subTitle?: string;
    steps?: StepConfig[];
};

type ActionConfig = {
    onClick: () => void;
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
};

type StepConfig = {
    title: string;
    fields: FieldConfig[];
    validationSchema: any;
    actions?: ActionConfig[];
};

const RightPanel: React.FC<DrawerProps> = ({
    onClose,
    initialValues,
    fields,
    validationSchema,
    onSave,
    actions,
    formRef,
    onDataChange,
    subTitle,
    steps,
    title,
}) => {
    const [activeStep, setActiveStep] = useState(0);
    const theme = useTheme();

    const isLastStep = () => activeStep === (steps ? steps.length - 1 : 0);

    const handleNext = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep: any) => prevActiveStep - 1);
    };

    const handleStep = (step: any) => () => {
        setActiveStep(step);
    };

    return (
        <Drawer variant={"temporary"} anchor={"right"} open={true} onClose={onClose}>
            <Box
                sx={{
                    width: 500,
                    p: 3,
                    height: "100vh",
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    {title && <Typography variant="h3">{title}</Typography>}
                    <IconButton onClick={() => onClose && onClose()}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                {subTitle && (
                    <Typography variant="subtitle1" color="textSecondary" mb={4}>
                        {subTitle}
                    </Typography>
                )}
                {steps && (
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((stepConfig, index) => (
                            <Step key={index}>
                                <StepButton onClick={handleStep(index)}>
                                    <StepLabel>{stepConfig.title}</StepLabel>
                                </StepButton>
                            </Step>
                        ))}
                    </Stepper>
                )}
                <Formik
                    initialValues={initialValues}
                    validationSchema={steps ? steps[activeStep].validationSchema : validationSchema}
                    onSubmit={(values: any) => {
                        if (isLastStep()) {
                            onSave && onSave(values);
                            onClose && onClose();
                        } else {
                            handleNext();
                        }
                    }}
                    innerRef={formRef}
                >
                    {({ errors, touched, values }: any) => {
                        useEffect(() => {
                            onDataChange && onDataChange(values);
                        }, [values]);

                        return (
                            <Form>
                                <Grid container spacing={3} mt={3}>
                                    {(steps! ? steps[activeStep].fields : fields!).map((field, index: number) => (
                                        <Grid item xs={6} key={index}>
                                            {field.type === "select" ? (
                                                <FormControl fullWidth size="medium">
                                                    <InputLabel id={`${field.name}-label`}>
                                                        {field.label}
                                                    </InputLabel>
                                                    <Field
                                                        name={field.name}
                                                        labelId={`${field.name}-label`}
                                                        as={Select}
                                                    >
                                                        {field.options?.map((option, index: number) => (
                                                            <MenuItem
                                                                key={index}
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
                                                    size="medium"
                                                    type={field.type || "text"}
                                                    helperText={
                                                        touched[field.name] && errors[field.name]
                                                    }
                                                    error={
                                                        touched[field.name] && !!errors[field.name]
                                                    }
                                                    InputLabelProps={
                                                        field.type === "date"
                                                            ? { shrink: true }
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        </Grid>
                                    ))}
                                </Grid>
                                <Box mt={3} display={"flex"} gap={"10px"} justifyContent={"end"}>
                                    {(steps ? steps[activeStep].actions! : actions!).map(
                                        (action, index) => (
                                            <Button
                                                key={index}
                                                onClick={action.onClick}
                                                // @ts-ignore
                                                color={action.color || "default"}
                                                variant={action.variant || "text"}
                                                sx={action.sx}
                                                type={action.type}
                                                endIcon={action.icon}
                                            >
                                                {action.label}
                                            </Button>
                                        ),
                                    )}
                                </Box>
                                {steps && (
                                    <Box mt={12} display="flex" justifyContent="space-between">
                                        <Button
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            Mbrapa
                                        </Button>
                                        {!isLastStep() && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                            >
                                                Tjetra
                                            </Button>
                                        )}
                                    </Box>
                                )}
                            </Form>
                        );
                    }}
                </Formik>
            </Box>
        </Drawer>
    );
};

export default RightPanel;
