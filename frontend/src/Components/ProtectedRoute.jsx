import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Loading from "./Loading"

function ProtectedRoute({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const checkAuth = async () => {
            setLoading(false)
        }
        checkAuth();
    }, [])
    if(loading) {
        return <Loading />
    }
    return isAuthenticated ? children : <Navigate to="/login" />;
    // return children
}

export default ProtectedRoute
