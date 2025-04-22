import axios from "axios";

const API_URL = "http://localhost:8000/api/"
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const signup = async (username, email, password) => {
    const response = await api.post("user/register/", JSON.stringify({
        username: username,
        email: email,
        password: password,
    }))
    
    return response.data
}

export const login = async (username, password) => {
    const response = await api.post("token/", {
        username: username,
        password: password
    })

    return response.data
}

export const logout = async () => {
    try {
        const response = await api.post("user/logout/");
        return response.data
    } catch(err) {
        console.error(err)
        return null
    }
};

export const checkAuth = async() => {
    const response = await api.post("user/status/")
    return response.data
}
