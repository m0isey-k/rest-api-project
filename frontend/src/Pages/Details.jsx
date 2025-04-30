import DefaultLayout from "./DefaultLayout"
import Loading from "../Components/Loading"

import { useParams } from "react-router-dom"
import { get_book_details, get_movie_details, add_collection_item } from "../api"
import { useState, useEffect, useRef } from "react"

function Details(){
    const { type, id } = useParams()
    const [data, setData] = useState()
    const [activeCollections, setActiveCollections] = useState([])

    const dropdownItems = ['Favorites', 'Collection 1', 'Collection 2']
    const dropdownIcons = ['bookmark', 'layer-group', 'layer-group']

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let result 
                switch(type) {
                    case "book":
                        result = await get_book_details(id)
                        setData(result)
                        setActiveCollections(result.collections)
                        break;
                    case "movie":
                        result = await get_movie_details(id)
                        setData(result)
                        setActiveCollections(result.collections)
                        break;
                }
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [id])
    
    const handleClick = async (collection) => {
        const updatedData = { ...data, collection }
        setData(updatedData)
        setActiveCollections(p => ([...p, collection]))
        await add_collection_item(id, updatedData)
    }

    return(
        data ? (
        <>
        <DefaultLayout title={data.title} content={
        <div className="mt-4 flex">
            <img src={data.thumbnail} className="w-80 rounded-xl object-cover border border-surface-a30 select-none"/>
            <div className="mx-8 text-white text-lg">
                <p className="text-xl font-medium">{data.title}</p>
                <p className="font-medium cursor-pointer hover:text-primary-a0 transition mb-4">{data.authors?.join(" / ")}</p> {/* TODO search by author */} 
                <p>{data.description}</p>
                <p className="my-2 font-medium">{data.categories.join(" / ")}</p>
                <div className="flex">
                    <p className="font-medium mr-2">{data.pageCount ? "Pages: " : "Runtime: "}</p>
                    <p>{data.pageCount || data.runtime + "m"}</p>
                </div>
                <p className="mt-2">Rating: {data.rating === 0 ? "N/A" : `${Math.round(data.rating * 10) / 10} / 5`}</p>
                <p>{data.collections}</p>
                <div className="inline-block mt-2">
                    <button ref={buttonRef} onClick={() => setDropdownOpen((p) => !p)} className="px-4 py-1 border border-primary-a0 rounded-full shadow-primary-a0 hover:shadow-[0_0_5px_1px] transition hover:bg-primary-a0 focus:bg-primary-a0 focus:shadow-[0_0_5px_1px]">Add<i className="fa-solid fa-caret-down ml-2"></i></button>
                    <div ref={dropdownRef}
                        className={`mt-2 shadow-[0_0_1px_1px] shadow-primary-a0 rounded-xl bg-surface-a10 transition ${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <ul className="text-surface-a50 py-2 select-none">
                        {dropdownItems.map((item, index) =>
                            <li key={index} className={`mx-4 my-3 px-4 py-2 text-sm rounded-full hover:text-white cursor-pointer transition ${activeCollections.includes(item.toLowerCase()) ? "text-white bg-primary-a0 " : "bg-surface-a20"}`} onClick={() => handleClick(item.toLowerCase())}>
                            <i className={`fa-solid fa-${dropdownIcons[index]} pr-2`}></i>
                            {item} 
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        }/>
        </>
        ):(<Loading />)
    )
}

export default Details
