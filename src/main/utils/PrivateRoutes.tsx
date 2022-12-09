import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const token = localStorage.token;
    return (
        token ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes