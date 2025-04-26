import Sidebar from "../Components/Sidebar"
import Header from "../Components/Header"
import Loading from "../Components/Loading"

import { useParams } from "react-router-dom"
import { get_book_details } from "../api"
import { useState, useEffect } from "react"

function Book(){
    const { id } = useParams()
    const [data, setData] = useState()
    const handleSearch = async () => {
        console.log("search") // TODO
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await get_book_details(id)
                setData(result)
            } catch (error) {
                console.error("Error fetching book details:", error)
            }
        }
        fetchData()
    }, [])

    return(
        data ? (
        <>
        <Header onSearch={handleSearch}/>
        <div className="mt-16 grid grid-cols-6 gap-8">
            <div className="col-span-1">
                <div className="sticky top-16">
                    <Sidebar />
                </div>
            </div>
            <div className="col-span-5">
        <div className="flex">
            <p className="text-xl text-white">{data.title}</p>
            <i className="fa-solid fa-bars my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer"></i>
        </div>
        <div className="mt-4 flex">
            <img src={data.thumbnail} className="rounded-xl object-cover border border-surface-a30 select-none"/>
            <div className="mx-8 text-white text-lg">
                <p className="text-xl font-medium">{data.title}</p>
                <p className="font-medium cursor-pointer hover:text-primary-a0 transition mb-4">{data.authors}</p> {/* TODO search by author */} 
                <p>{data.description}</p>
                <p className="my-2 font-medium">{data.categories.join(", ")}</p>
                <div className="flex">
                    <p className="font-medium mr-2">Pages:</p>
                    <p>{data.pageCount}</p>
                </div>
            </div>
        </div>
            </div>
        </div>
        </>
        ):(<Loading />)
    )
}

export default Book
