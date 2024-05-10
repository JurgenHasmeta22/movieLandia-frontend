import { Box } from "@mui/material";
import Header from "~/components/admin/headerDashboard/HeaderDashboard";
import { useNavigate } from "react-router";
import * as yup from "yup";
import { toast } from "react-toastify";
import authenticationService from "~/services/api/authenticationService";
import FormAdvanced from "~/components/admin/form/Form";
import { FormikProps } from "formik";
import { useState, useRef } from "react";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import * as CONSTANTS from "~/constants/Constants";

const serieSchema = yup.object().shape({
    seriename: yup.string().required("required"),
    email: yup.string().required("required"),
    password: yup.string().required("required"),
});

const AddSerie = () => {
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const formikRef = useRef<FormikProps<any>>(null);

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        // const response = await authenticationService.onRegister(
        //     values.title,
        //     values.email,
        //     values.password,
        // );
        // if (response) {
        //     toast.success(CONSTANTS.ADD__SUCCESS);
        //     navigate("/admin/series");
        // } else {
        //     toast.error(CONSTANTS.ADD__FAILURE);
        // }
    };

    return (
        <Box m="20px">
            <Header title={CONSTANTS.USERS__ADD__TITLE} subtitle={CONSTANTS.USERS__ADD__SUBTITLE} />
            <FormAdvanced
                initialValues={{
                    title: "",
                    photoSrc: "",
                    releaseYear: "",
                    ratingImdb: "",
                }}
                fields={[
                    {
                        name: "title",
                        label: "Title",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "photoSrc",
                        label: "Photo src",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "releaseYear",
                        label: "Release year",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "ratingImdb",
                        label: "Rating imdb",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                actions={[
                    {
                        label: CONSTANTS.FORM__UPDATE__BUTTON,
                        type: "submit",
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            border: "1px solid #000",
                            bgcolor: "#30969f",
                            fontSize: "15px",
                            fontWeight: "700",
                        },
                        icon: <SaveAsIcon sx={{ ml: "10px" }} color="action" />,
                    },
                    {
                        label: CONSTANTS.FORM__RESET__BUTTON,
                        type: "reset",
                        onClick: () => {
                            handleResetFromParent();
                        },
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            border: "1px solid #000",
                            bgcolor: "#ff5252",
                            fontSize: "15px",
                            fontWeight: "700",
                        },
                        icon: <ClearAllIcon color="action" sx={{ ml: "10px" }} />,
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={serieSchema}
                formRef={formikRef}
            />
        </Box>
    );
};

export default AddSerie;
