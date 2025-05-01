import DefaultLayout from "./DefaultLayout";
import Card from "../Components/Card";
import { useState, useEffect } from "react";
import { get_collection } from "../api";
import { useParams } from "react-router-dom";


function Collection(){
    const [cards, setCards] = useState([]) 
    const { collection } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_collection(collection)
                console.log(data)
                setCards([])
                data.map(item => {
                    setCards(p => [...p, <Card key={item.item_id} title={item.title} thumbnail={item.thumbnail} authors={item.authors} rating={item.rating} link={`/${item.type}/${item.item_id}`} />])
                }) 
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [collection])

    return(
        <>
        <DefaultLayout title={collection} content={
        <div className="mt-4 flex flex-wrap items-start gap-8">
            {cards}
        </div>
        } />
        </>
    )
}

export default Collection 
