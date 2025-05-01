import { useEffect, useState } from "react"
import { get_user_collections } from "../api"

function Sidebar({ newCollection }){
    const [collections, setCollections] = useState(['Favorites', 'Books', 'Movies'])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userCollections = await get_user_collections()
                setCollections(p => [...p, ...userCollections])

            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        if(newCollection && !collections.includes(newCollection)) {
            setCollections(p => [...p, newCollection])
        }
    }, [newCollection])

    return(
        <div className="border border-primary-a0 text-surface-a30 select-none rounded-xl mx-4 px-4 py-2">
            {collections.map((item, index) => 
            <a key={index} href={`/collection/${item.toLowerCase()}`}>
            <div key={index} className="flex justify-between my-1 hover:text-white transition cursor-pointer">
                    <p key={index}>{item}</p>
                    <i className="fa-solid fa-caret-right my-auto"></i>
            </div>
            </a>
            )}
        </div>
    );
}

export default Sidebar
