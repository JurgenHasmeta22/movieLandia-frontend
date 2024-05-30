import {
    Box,
    Button,
    CircularProgress,
    Stack,
    Tab,
    Tabs,
    Typography,
    useTheme,
} from "@mui/material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "~/store/store";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { tokens } from "~/utils/theme";
import TabPanel from "~/components/tab/Tab";
import SEOHelmet from "~/components/seoHelmet/SEOHelmet";
import FavoritesTab from "~/components/favorites/Favorites";
import EmailIcon from "@mui/icons-material/Email";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import userService from "~/services/api/userService";
import IUser from "~/types/IUser";
import { useRightPanel } from "~/services/providers/RightPanelContext";
import * as CONSTANTS from "~/constants/Constants";
import * as Yup from "yup";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import { FormikProps } from "formik";
import IUserPatch from "~/types/IUserPatch";

const userSchema = Yup.object().shape({
    userName: Yup.string()
        .required("Username is a required field")
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username can't be longer than 20 characters")
        .matches(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: Yup.string().required("Email is a required field").email("Invalid email format"),
});

export default function Profile() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, setUser } = useStore();
    const theme = useTheme();
    const { openRightPanel } = useRightPanel();
    const formikRef = useRef<FormikProps<any>>(null);
    const colors = tokens(theme.palette.mode);
    const tabValue =
        searchParams?.get("tab")! === "favMovies"
            ? 0
            : searchParams?.get("tab")! === "favSeries"
              ? 1
              : 0;

    const handleChange = (event: any, newValue: number) => {
        if (newValue === 0) {
            navigate("/profile?tab=favMovies");
        } else if (newValue === 1) {
            navigate("/profile?tab=favSeries");
        }
    };

    const handleResetFromParent = () => {
        formikRef.current?.resetForm();
    };

    const handleEditProfile = useCallback(() => {
        openRightPanel({
            formRef: formikRef,
            initialValues: {
                id: user?.id,
                userName: user?.userName,
                email: user?.email,
            },
            fields: [
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
            ],
            validationSchema: userSchema,
            onSave: async (values: any) => {
                const payload: IUserPatch = {
                    userName: values.userName,
                    email: values.email,
                };

                const response = await userService.updateUser(payload, values.id);

                if (response) {
                    toast.success(CONSTANTS.UPDATE__SUCCESS);
                    setUser(response);
                } else {
                    toast.error(CONSTANTS.UPDATE__FAILURE);
                }
            },
            title: "Edit Profile",
            actions: [
                {
                    label: CONSTANTS.FORM__RESET__BUTTON,
                    onClick: () => {
                        handleResetFromParent();
                    },
                    type: "reset",
                    color: "secondary",
                    variant: "contained",
                    sx: {
                        border: "1px solid #000",
                        bgcolor: "#ff5252",
                        fontSize: "15px",
                        fontWeight: "700",
                    },
                    icon: <ClearAllIcon />,
                },
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
                    icon: <SaveAsIcon />,
                },
            ],
            subTitle: "Enter the details of the user you want to edit",
        });
    }, [user]);

    if (!user) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <CircularProgress size={80} thickness={4} color="secondary" />
            </Box>
        );
    }

    return (
        <>
            <SEOHelmet
                title="Your Profile - MovieLand24"
                description="View and manage your profile on MovieLand24. Update your preferences, view your watchlist, and more."
                name="MovieLand24"
                type="website"
                canonicalUrl="https://example.com/profile"
            />
            <Stack
                flexDirection="row"
                px={4}
                py={10}
                columnGap={4}
                rowGap={4}
                flexWrap={"wrap"}
                width={"100%"}
            >
                <Stack
                    component="section"
                    sx={{
                        backgroundColor: `${colors.primary[400]}`,
                        borderRadius: "34px",
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        boxShadow: 6,
                        rowGap: 1,
                        width: ["100%", "100%", "30%", "30%"],
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <PersonOutlinedIcon
                            color="secondary"
                            sx={{
                                fontSize: [14, 16, 18, 20],
                            }}
                        />
                        <Typography
                            color="secondary"
                            component={"span"}
                            sx={{
                                fontSize: [14, 16, 18, 20],
                            }}
                        >
                            {user.userName}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "center",
                            columnGap: 0.5,
                            flexWrap: "wrap",
                        }}
                    >
                        <EmailIcon
                            color="secondary"
                            sx={{
                                fontSize: [14, 16, 18, 20],
                            }}
                        />
                        <Typography
                            color="secondary"
                            component={"span"}
                            sx={{
                                fontSize: [12, 14, 16, 18, 22],
                            }}
                        >
                            {user.email}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            color="secondary"
                            sx={{
                                fontSize: [12, 14, 16, 18, 22],
                            }}
                            component={"span"}
                        >
                            Favorite Movies: {user.favMovies?.length}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            color="secondary"
                            component={"span"}
                            sx={{
                                fontSize: [12, 14, 16, 18, 22],
                            }}
                        >
                            Favorite Series: {user.favSeries?.length}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            onClick={() => {
                                handleEditProfile();
                            }}
                            color="error"
                            variant="outlined"
                        >
                            <Typography
                                component={"span"}
                                sx={{
                                    fontSize: [12, 14, 16, 18],
                                    textTransform: "capitalize",
                                }}
                            >
                                Edit Profile
                            </Typography>
                        </Button>
                    </Box>
                </Stack>
                <Box
                    component="section"
                    sx={{
                        backgroundColor: colors.primary[400],
                        borderRadius: "34px",
                        padding: 4,
                        boxShadow: 6,
                        width: ["100%", "100%", "65%", "65%"],
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={handleChange}
                        variant="fullWidth"
                        orientation="horizontal"
                    >
                        <Tab
                            label="Favorite Movies"
                            tabIndex={0}
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.primary[100],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                            }}
                        />
                        <Tab
                            label="Favorite Series"
                            tabIndex={1}
                            sx={{
                                backgroundColor: colors.blueAccent[700],
                                color: colors.primary[100],
                                fontWeight: "600",
                                fontSize: 14,
                                textTransform: "capitalize",
                            }}
                        />
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <FavoritesTab type={"Movies"} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <FavoritesTab type={"Series"} />
                    </TabPanel>
                </Box>
            </Stack>
        </>
    );
}
