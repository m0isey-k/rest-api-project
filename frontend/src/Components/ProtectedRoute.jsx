import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loading from "./Loading"
import { checkAuth } from "../api";

function ProtectedRoute({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const auth = async () => {
            try {
                await checkAuth();
                setIsAuthenticated(true);
            } catch (e) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        auth();
    }, [])
    if(loading) {
        return <Loading />
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default ProtectedRoute
