import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Card from "../Components/Card";
import { useState } from "react";
import axios from "axios";

function Home(){
    const [search, setSearch] = useState("")
    const handleSearch = async (term) => {
        setSearch(term)
        console.log("Search for:", term)
        const response = await axios.get(`http://localhost:8000/api/get-books/`, {params: { query: term }})
        console.log(response)
    }

    const cards = []
    for(let i = 0; i < 20; i++) {
        cards.push(<Card key={i}/>)
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
            <p className="text-xl text-white">Home</p>
            <i className="fa-solid fa-bars my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer"></i>
        </div>
        <div className="mt-4 flex flex-wrap gap-8">
            {cards}
        </div>
            </div>
        </div>
        </>
    )
}

export default Home
