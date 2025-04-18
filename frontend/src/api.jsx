import axios from "axios";

const API_URL = "http://localhost:8000/api/"
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        
    },
})

export const signup = async (username, email, password) => {
    const response = await api.post("user/register/", JSON.stringify({
        username: username,
        email: email,
        password: password,
    }))
    
    return response
}

export const login = async (username, password) => {
    const response = await api.post("token/", {
        username: username,
        password: password
    })

    return response
}

export const logout = async () => {
    const response = await api.post("user/logout/");
    return response
};
