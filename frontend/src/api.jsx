import axios from "axios";

const API_URL = "http://localhost:8000/api/"
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
})

export const signup = async (username, email, password) => {
    const response = await api.post("user/register/", {
        username: username,
        email: email,
        password: password,
    })
    
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
        const response = await api.get("user/logout/");
        return response.data
    } catch(err) {
        console.error(err)
        return null
    }
};

export const checkAuth = async () => {
    const response = await api.post("user/status/")
    return response.data
}

export const get_home = async () => {
    const response = await api.get("home/")
    return response.data
}

export const get_search = async (term) => {
    const response = await api.get("search/", {params: { query: term }})
    return response.data
}

export const get_book_details = async (id) => {
    const response = await api.get(`book-details/`, {params: { id: id }})
    return response.data
}

export const get_movie_details = async (id) => {
    const response = await api.get(`movie-details/`, {params: { id: id }})
    return response.data
}

export const add_collection_item = async (id, data) => {
    const response = await api.post('create-item/', {
        item_id: id,
        title: data.title,
        thumbnail: data.thumbnail,
        author: 'test',
        rating: data.rating,
        type: data.type,
        collection: data.collection,
    })
    return response.data
}

export const delete_collection_item = async (item_id, collection) => {
    const response = await api.delete('delete-item/', {
        data: {
            item_id: item_id,
            collection: collection
        }
    })
    return response.data
}
