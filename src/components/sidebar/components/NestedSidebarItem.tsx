import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Collapse,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
} from "@mui/material";
import React from "react";
import { useStore } from "~/store/store";
import { tokens } from "~/utils/theme";

export const NestedSidebarItem = ({ item, selectedLabel, handleItemClick, isEmployee }: any) => {
    const { openSubMenu, setOpenSubMenu } = useStore();
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleClick = () => {
        setOpenSubMenu(!openSubMenu);
    };

    return (
        <React.Fragment key={item.label}>
            <ListItem>
                <ListItemButton
                    disableRipple={true}
                    sx={{
                        color: colors.grey[1500],
                    }}
                    onClick={() => {
                        handleClick();
                    }}
                >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} />
                    {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
            </ListItem>
            <Collapse in={openSubMenu}>
                <List disablePadding sx={{ paddingLeft: "50px" }}>
                    {item.submenu.map((subItem: any, index: number) => (
                        <ListItem key={index} value={subItem.label}>
                            <ListItemButton
                                disableRipple={true}
                                disabled={isEmployee && subItem.label === "Lista e lejeve"}
                                sx={{
                                    color: colors.grey[1500],
                                    "&.Mui-selected": {
                                        backgroundColor: colors.primary[1000],
                                        color: colors.grey[1400],
                                        "&:hover": {
                                            backgroundColor: colors.primary[1100],
                                        },
                                    },
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
                                selected={selectedLabel === subItem.label}
                                onClick={() => {
                                    handleItemClick(subItem.label, subItem.to, {
                                        label: subItem.label,
                                        index,
                                    });
                                }}
                            >
                                <ListItemText primary={subItem.label} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
};
