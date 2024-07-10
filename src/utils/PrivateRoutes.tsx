import { Outlet, Navigate } from "react-router-dom";
import { useLocalStorage } from "~/hooks/useLocalStorage";

const PrivateRoutes = () => {
    const { getItem } = useLocalStorage<string>("token");
    return getItem() ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
