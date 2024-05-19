import { Box, CircularProgress, Typography } from "@mui/material";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import movieService from "~/services/api/movieService";
import { FormikProps } from "formik";
import * as yup from "yup";
import IMovie from "~/types/IMovie";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Link, useParams } from "react-router-dom";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "~/components/admin/form/Form";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import Breadcrumb from "~/components/admin/breadcrumb/Breadcrumb";
import IMoviePatch from "~/types/IMoviePatch";

const movieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    trailerSrc: yup.string().required("required"),
    duration: yup.string().required("required"),
    releaseYear: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
    description: yup.string().required("required"),
});

const MovieAdmin = () => {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const formikRef = useRef<FormikProps<any>>(null);

    const breadcrumbs = [
        <Link key="1" to={`${location.state?.from!}`} style={{ textDecoration: "none" }}>
            {location.state?.from!}
        </Link>,
        <Typography key="2" color="text.primary">
            Movie details
        </Typography>,
    ];

    const handleDataChange = (values: any) => {
        setFormData(values);
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleFormSubmit = async (values: any) => {
        const payload: IMoviePatch = {
            title: values.title,
            description: values.description,
            duration: values.duration,
            photoSrc: values.photoSrc,
            trailerSrc: values.trailerSrc,
            ratingImdb: Number(values.ratingImdb),
            releaseYear: Number(values.releaseYear),
        };
        const response = await movieService.updateMovie(payload, movie?.id!);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getMovie();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getMovie(): Promise<void> {
        const response: IMovie = await movieService.getMovieById(params.id);
        setMovie(response);
    }

    useEffect(() => {
        async function fetchData() {
            await getMovie();
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/movies"} />
            <HeaderDashboard
                title={CONSTANTS.MOVIE__EDIT__TITLE}
                subtitle={CONSTANTS.MOVIE__EDIT__SUBTITLE}
            />
            <FormAdvanced
                initialValues={{
                    id: movie?.id,
                    title: movie?.title,
                    trailerSrc: movie?.trailerSrc,
                    photoSrc: movie?.photoSrc,
                    description: movie?.description,
                    releaseYear: movie?.releaseYear,
                    ratingImdb: movie?.ratingImdb,
                    duration: movie?.duration,
                }}
                fields={[
                    {
                        name: "id",
                        label: "Id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
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
                        name: "description",
                        label: "Description",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "trailerSrc",
                        label: "Trailer src",
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
                    {
                        name: "duration",
                        label: "Duration",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={movieSchema}
                formRef={formikRef}
                actions={[
                    {
                        label: CONSTANTS.FORM__DELETE__BUTTON,
                        onClick: async () => {},
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

export default MovieAdmin;
