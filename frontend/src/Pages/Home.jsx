import DefaultLayout from "./DefaultLayout";
import Card from "../Components/Card";
import { useState, useEffect } from "react";
import { get_home } from "../api";

function Home(){
    const [cards, setCards] = useState([]) 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_home()
                setCards([])
                data.map(item => {
                    setCards(p => [...p, <Card key={item.id} title={item.title} thumbnail={item.thumbnail} authors={item.authors} rating={item.rating} link={`/${item.type}/${item.id}`} />])
                }) 
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [])

    return(
        <>
        <DefaultLayout title="Home" content={
            <div className="mt-4 flex flex-wrap items-start gap-8">
            {cards}
            </div>
        } />
        </>
    )
}

export default Home
