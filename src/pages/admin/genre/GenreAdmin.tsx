import { Box, CircularProgress, Typography } from "@mui/material";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import genreService from "~/services/api/genreService";
import { FormikProps } from "formik";
import * as yup from "yup";
import IGenre from "~/types/IGenre";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Link, useParams } from "react-router-dom";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "~/components/admin/form/Form";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import Breadcrumb from "~/components/admin/breadcrumb/Breadcrumb";

const genreSchema = yup.object().shape({
    name: yup.string().required("required"),
});

const GenreAdmin = () => {
    const [genre, setGenre] = useState<IGenre | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const formikRef = useRef<FormikProps<any>>(null);

    const breadcrumbs = [
        <Link key="1" to={"/genres"} style={{ textDecoration: "none" }}>
            {location.state?.from!}
        </Link>,
        <Typography key="2" color="text.primary">
            Genre details
        </Typography>,
    ];

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        // const payload = {
        //     name: values.name,
        //     genreFirstname: values.genreFirstname,
        //     genreLastname: values.genreLastname,
        //     genreEmail: values.genreEmail,
        //     balancaLeje: values.balancaLeje,
        //     genreIsActive: values.genreIsActive,
        // };
        // const response = await genreService.updateGenre(genre?.genreId, payload);
        // if (response) {
        //     toast.success(CONSTANTS.UPDATE__SUCCESS);
        //     getGenre();
        // } else {
        //     toast.error(CONSTANTS.UPDATE__FAILURE);
        // }
    };

    async function getGenre(): Promise<void> {
        const response: IGenre = await genreService.getGenreById(params.id);
        setGenre(response);
    }

    useEffect(() => {
        async function fetchData() {
            await getGenre();
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/genres"} />
            <HeaderDashboard
                title={CONSTANTS.USER__EDIT__TITLE}
                subtitle={CONSTANTS.USER__EDIT__SUBTITLE}
            />
            <FormAdvanced
                initialValues={{
                    id: genre?.id,
                    name: genre?.name,
                }}
                fields={[
                    {
                        name: "id",
                        label: "Genre id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "name",
                        label: "Genrename",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={genreSchema}
                formRef={formikRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {
                            // const response = await genreService.updateGenre(genreId, {
                            //     ...genre,
                            //     genreIsActive: false,
                            // });
                            // if (response) {
                            //     toast.success(CONSTANTS.GLOBAL__DELETE__SUCCESS);
                            //     navigate("/genres");
                            // } else {
                            //     toast.error(CONSTANTS.GLOBAL__DELETE__FAILURE);
                            // }
                        },
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            bgcolor: "#ff5252",
                        },
                        icon: <ClearOutlinedIcon color="action" sx={{ ml: "10px" }} />,
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
                            bgcolor: "#00bfff",
                        },
                        icon: <ClearAllIcon color="action" sx={{ ml: "10px" }} />,
                    },
                    {
                        label: CONSTANTS.FORM__UPDATE__BUTTON,
                        type: "submit",
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            bgcolor: "#30969f",
                        },
                        icon: <SaveAsIcon sx={{ ml: "10px" }} color="action" />,
                    },
                ]}
            />
        </Box>
    );
};

export default GenreAdmin;
