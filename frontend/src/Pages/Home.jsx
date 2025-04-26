import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Card from "../Components/Card";
import { useState } from "react";
import { get_books, get_book_details } from "../api";
import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate()
    const [cards, setCards] = useState([]) 

    const handleSearch = async (term) => {
        const data = await get_books(term)
        setCards([])
        data.map(item => {
            setCards(p => [...p, <Card key={item.id} title={item.title} thumbnail={item.thumbnail} authors={item.authors} onClick={() => navigate(`/book/${item.id}`)} />])
        })
    }

    return(
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
            <p className="text-xl text-white">Search</p>
            <i className="fa-solid fa-bars my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer"></i>
        </div>
        <div className="mt-4 flex flex-wrap items-start gap-8">
            {cards}
        </div>
            </div>
        </div>
        </>
    )
}

export default Home
