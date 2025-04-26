import DefaultLayout from "./DefaultLayout";
import Card from "../Components/Card";
import { useState } from "react";
import { get_search } from "../api";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate()
    const [cards, setCards] = useState([]) 

    const handleSearch = async (term) => {
        const data = await get_search(term)
        setCards([])
        data.map(item => {
            setCards(p => [...p, <Card key={item.id} title={item.title} thumbnail={item.thumbnail} authors={item.authors} onClick={() => navigate(`/${item.type}/${item.id}`)} />])
        })
    }

    return(
        <>
        <DefaultLayout title="Home" handleSearch={handleSearch} content={
        <div className="mt-4 flex flex-wrap items-start gap-8">
            {cards}
        </div>
        } />
        </>
    )
}

export default Home
