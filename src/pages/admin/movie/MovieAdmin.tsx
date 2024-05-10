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

const movieSchema = yup.object().shape({
    title: yup.string().required("required"),
    photoSrc: yup.string().required("required"),
    videoSrc: yup.string().required("required"),
    trailerSrc: yup.string().required("required"),
    duration: yup.string().required("required"),
    releaseYear: yup.string().required("required"),
    ratingImdb: yup.string().required("required"),
    description: yup.string().required("required"),
});

const MovieAdmin = () => {
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [id, setId] = useState<number | undefined>(0);
    const [title, setTitle] = useState<string>("");
    const [photoSrc, setPhotoSrc] = useState<string>("");
    const [videoSrc, setVideoSrc] = useState<string>("");
    const [trailerSrc, setTrailerSrc] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [ratingImdb, setRatingImdb] = useState<number>(0);
    const [releaseYear, setReleaseYear] = useState<number>(0);
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
        // const payload = {
        //     movieName: values.movieName,
        //     movieFirstname: values.movieFirstname,
        //     movieLastname: values.movieLastname,
        //     movieEmail: values.movieEmail,
        //     balancaLeje: values.balancaLeje,
        //     movieIsActive: values.movieIsActive,
        // };
        // const response = await movieService.updateMovie(movie?.movieId, payload);
        // if (response) {
        //     toast.success(CONSTANTS.UPDATE__SUCCESS);
        //     getMovie();
        // } else {
        //     toast.error(CONSTANTS.UPDATE__FAILURE);
        // }
    };

    async function getMovie(): Promise<void> {
        const response: IMovie = await movieService.getMovie(params.id);

        setMovie(response);
        setId(response.id!);
        setTitle(response.title);
        setTrailerSrc(response.trailerSrc);
        setVideoSrc(response.videoSrc);
        setPhotoSrc(response.photoSrc);
        setDuration(response.duration);
        setDescription(response.description);
        setRatingImdb(response.ratingImdb);
        setReleaseYear(response.releaseYear);
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
                    id,
                    title,
                    trailerSrc,
                    videoSrc,
                    photoSrc,
                    description,
                    releaseYear,
                    ratingImdb,
                    duration,
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
                        name: "videoSrc",
                        label: "Video src",
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
                        label: "Elemino",
                        onClick: async () => {
                            // const response = await movieService.updateMovie(movieId, {
                            //     ...movie,
                            //     movieIsActive: false,
                            // });
                            // if (response) {
                            //     toast.success(CONSTANTS.GLOBAL__DELETE__SUCCESS);
                            //     navigate("/movies");
                            // } else {
                            //     toast.error(CONSTANTS.GLOBAL__DELETE__FAILURE);
                            // }
                        },
                        color: "secondary",
                        variant: "contained",
                        sx: {
                            border: "1px solid #000",
                            bgcolor: "#ff5252",
                            fontSize: "15px",
                            fontWeight: "700",
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
                            border: "1px solid #000",
                            bgcolor: "#ff5252",
                            fontSize: "15px",
                            fontWeight: "700",
                        },
                        icon: <ClearAllIcon color="action" sx={{ ml: "10px" }} />,
                    },
                ]}
            />
        </Box>
    );
};

export default MovieAdmin;
