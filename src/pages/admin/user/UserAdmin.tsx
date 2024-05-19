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
import IUserPatch from "~/types/IUserPatch";

const userSchema = yup.object().shape({
    userName: yup.string().required("required"),
    email: yup.string().required("required"),
});

const UserAdmin = () => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});

    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const formikRef = useRef<FormikProps<any>>(null);

    const breadcrumbs = [
        <Link key="1" to={"/admin/users"} style={{ textDecoration: "none" }}>
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
        const payload: IUserPatch = {
            userName: values.userName,
            email: values.email,
            password: values.password,
        };
        const response = await userService.updateUser(payload, user?.id!);

        if (response) {
            toast.success(CONSTANTS.UPDATE__SUCCESS);
            getUser();
        } else {
            toast.error(CONSTANTS.UPDATE__FAILURE);
        }
    };

    async function getUser(): Promise<void> {
        const response: IUser = await userService.getUserById(params.id);
        setUser(response);
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
            <Breadcrumb breadcrumbs={breadcrumbs} navigateTo={"/admin/users"} />
            <HeaderDashboard
                title={CONSTANTS.USER__EDIT__TITLE}
                subtitle={CONSTANTS.USER__EDIT__SUBTITLE}
            />
            <FormAdvanced
                initialValues={{
                    id: user?.id,
                    userName: user?.userName,
                    email: user?.email,
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

export default UserAdmin;
