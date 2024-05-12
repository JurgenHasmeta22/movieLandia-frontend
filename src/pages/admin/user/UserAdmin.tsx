import { Box, CircularProgress, Typography } from "@mui/material";
import HeaderDashboard from "~/components/admin/headerDashboard/HeaderDashboard";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import userService from "~/services/api/userService";
import { FormikProps } from "formik";
import * as yup from "yup";
import IUser from "~/types/IUser";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { Link, useParams } from "react-router-dom";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import FormAdvanced from "~/components/admin/form/Form";
import { toast } from "react-toastify";
import * as CONSTANTS from "~/constants/Constants";
import Breadcrumb from "~/components/admin/breadcrumb/Breadcrumb";

const userSchema = yup.object().shape({
    userName: yup.string().required("required"),
    email: yup.string().required("required"),
});

const UserAdmin = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [id, setId] = useState<number | undefined>(0);
    const [userName, setUserName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const formikRef = useRef<FormikProps<any>>(null);

    const breadcrumbs = [
        <Link key="1" to={"/users"} style={{ textDecoration: "none" }}>
            {location.state?.from!}
        </Link>,
        <Typography key="2" color="text.primary">
            User details
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
        //     userName: values.userName,
        //     userFirstname: values.userFirstname,
        //     userLastname: values.userLastname,
        //     userEmail: values.userEmail,
        //     balancaLeje: values.balancaLeje,
        //     userIsActive: values.userIsActive,
        // };
        // const response = await userService.updateUser(user?.userId, payload);
        // if (response) {
        //     toast.success(CONSTANTS.UPDATE__SUCCESS);
        //     getUser();
        // } else {
        //     toast.error(CONSTANTS.UPDATE__FAILURE);
        // }
    };

    async function getUser(): Promise<void> {
        const response: IUser = await userService.getUserById(params.id);

        setUser(response);
        setId(response.id!);
        setUserName(response.userName);
        setEmail(response.email);
    }

    useEffect(() => {
        async function fetchData() {
            await getUser();
            setLoading(false);
        }

        fetchData();
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Box m="20px">
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/users"} />
            <HeaderDashboard
                title={CONSTANTS.USER__EDIT__TITLE}
                subtitle={CONSTANTS.USER__EDIT__SUBTITLE}
            />
            <FormAdvanced
                initialValues={{
                    id,
                    userName,
                    email,
                }}
                fields={[
                    {
                        name: "id",
                        label: "User id",
                        disabled: true,
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "userName",
                        label: "Username",
                        variant: "filled",
                        type: "text",
                    },
                    {
                        name: "email",
                        label: "Email",
                        variant: "filled",
                        type: "text",
                    },
                ]}
                onDataChange={(values: any) => {
                    handleDataChange(values);
                }}
                onSubmit={handleFormSubmit}
                validationSchema={userSchema}
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
                            // const response = await userService.updateUser(userId, {
                            //     ...user,
                            //     userIsActive: false,
                            // });
                            // if (response) {
                            //     toast.success(CONSTANTS.GLOBAL__DELETE__SUCCESS);
                            //     navigate("/users");
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

export default UserAdmin;
