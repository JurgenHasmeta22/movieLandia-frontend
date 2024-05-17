import { Box, Button, Breadcrumbs } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";

type BreadcrumbProps = {
    breadcrumbs: JSX.Element[];
    navigateTo: string;
};

const Breadcrumb = ({ breadcrumbs, navigateTo }: BreadcrumbProps) => {
    const navigate = useNavigate();

    return (
        <Box
            mb={"30px"}
            display={"flex"}
            component={"nav"}
            flexDirection={"row"}
            alignItems={"center"}
            gap={"20px"}
        >
            <Button
                color="secondary"
                variant="contained"
                onClick={() => {
                    navigate(navigateTo);
                }}
            >
                <ArrowBackIcon color="action" />
            </Button>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbs}
            </Breadcrumbs>
        </Box>
    );
};

export default Breadcrumb;
