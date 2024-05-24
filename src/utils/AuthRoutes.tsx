import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useLocalStorage } from "~/hooks/useLocalStorage";

const AuthRoutes = () => {
    const { getItem } = useLocalStorage<string>("token");
    
    return getItem() ? <Navigate to="/movies" /> : <Outlet />;
};

export default AuthRoutes;
