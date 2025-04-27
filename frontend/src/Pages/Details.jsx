import DefaultLayout from "./DefaultLayout"
import Loading from "../Components/Loading"

import { useParams } from "react-router-dom"
import { get_book_details, get_movie_details } from "../api"
import { useState, useEffect } from "react"

function Details(){
    const { type, id } = useParams()
    const [data, setData] = useState()

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result 
                switch(type) {
                    case "book":
                        result = await get_book_details(id)
                        setData(result)
                        break;
                    case "movie":
                        result = await get_movie_details(id)
                        setData(result)
                        break;
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    return(
        data ? (
        <>
        <DefaultLayout title={data.title} content={
        <div className="mt-4 flex">
            <img src={data.thumbnail} className="w-80 rounded-xl object-cover border border-surface-a30 select-none"/>
            <div className="mx-8 text-white text-lg">
                <p className="text-xl font-medium">{data.title}</p>
                <p className="font-medium cursor-pointer hover:text-primary-a0 transition mb-4">{data.authors.join(" / ")}</p> {/* TODO search by author */} 
                <p>{data.description}</p>
                <p className="my-2 font-medium">{data.categories.join(" / ")}</p>
                <div className="flex">
                <p className="font-medium mr-2">{data.pageCount ? "Pages: " : "Runtime: "}</p>
                    <p>{data.pageCount || data.runtime + "m"}</p>
                </div>
            </div>
        </div>
        }/>
        </>
        ):(<Loading />)
    )
}

export default Details
