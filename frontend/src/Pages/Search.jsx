import DefaultLayout from "./DefaultLayout";
import Card from "../Components/Card";
import { useState, useEffect } from "react";
import { get_search } from "../api";
import { useNavigate, useParams } from "react-router-dom";

function Search(){
    const navigate = useNavigate()
    const [cards, setCards] = useState([]) 
    const { term } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await get_search(term)
                setCards([])
                data.map(item => {
                    setCards(p => [...p, <Card key={item.id} title={item.title} thumbnail={item.thumbnail} authors={item.authors} rating={item.rating} link={`/${item.type}/${item.id}`} />])
                }) 
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }
        fetchData()
    }, [term])

    return(
        <>
        <DefaultLayout title={term} content={
        <div className="mt-4 flex flex-wrap items-start gap-8">
            {cards}
        </div>
        } />
        </>
    )
}

export default Search 
