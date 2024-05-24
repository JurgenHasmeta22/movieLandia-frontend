import { useState } from "react";
import {
    Box,
    List,
    Typography,
    Avatar,
    Drawer,
    IconButton,
    useTheme,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";
import { SidebarItem } from "./components/SidebarItem";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocalStorage } from "~/hooks/useLocalStorage";

const Sidebar = ({ sidebarItems }: any) => {
    const { user, setUser, isOpenSidebarAdmin, setIsOpenSidebarAdmin } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedLabel, setSelectedLabel] = useState(location.state ? location.state.label : "");
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { removeItem } = useLocalStorage("token");

    const handleItemClick = (title: string, to: string, state: any) => {
        setSelectedLabel(title);
        navigate(to, { state });

        if (window.innerWidth < 768) {
            setIsOpenSidebarAdmin(false);
        }
    };

    const onClose = () => {
        setIsOpenSidebarAdmin(false);
    };

    return (
        <Drawer
            variant={"persistent"}
            anchor={"left"}
            open={isOpenSidebarAdmin}
            component={"aside"}
            onClose={onClose}
            PaperProps={{
                sx: { backgroundColor: colors.grey[1000], paddingLeft: 2, paddingRight: 2 },
            }}
        >
            <Box mt={2}>
                <Box display="flex" justifyContent="end" alignItems="center" mb={2}>
                    <IconButton onClick={onClose}>
                        <CloseIcon color="action" />
                    </IconButton>
                </Box>
                <Box display="flex" alignItems="center" mb={2} ml={2}>
                    <Avatar>
                        <AccountCircleIcon />
                    </Avatar>
                    <Box ml={2}>
                        <Typography variant="body2" color="textSecondary">
                            {user && `@${user?.userName}`}
                        </Typography>
                    </Box>
                </Box>
                <List disablePadding>
                    {sidebarItems?.map((item: any, index: number) => (
                        <SidebarItem
                            key={index}
                            item={item}
                            index={index}
                            selectedLabel={selectedLabel}
                            handleItemClick={handleItemClick}
                        />
                    ))}
                    <ListItem
                        value={"logout"}
                        sx={{
                            py: 6,
                            px: 3,
                        }}
                    >
                        <ListItemButton
                            sx={{
                                color: colors.grey[1500],
                                "&:hover": {
                                    backgroundColor: colors.primary[1000],
                                    "& .MuiListItemIcon-root": {
                                        color: colors.grey[1400],
                                    },
                                    "& .MuiListItemText-primary": {
                                        color: colors.grey[1400],
                                    },
                                },
                            }}
                            onClick={() => {
                                setUser(null);
                                removeItem();
                                navigate("/login");
                            }}
                        >
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Logout"} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
