import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import Card from "../Components/Card";

function Home(){
    const cards = []
    for(let i = 0; i < 20; i++) {
        cards.push(<Card key={i}/>)
    }
    return(
        <>
        <Header />
        <div className="mt-16 grid grid-cols-6 gap-8">
            <div className="col-span-1">
                <div className="sticky top-16">
                    <Sidebar />
                </div>
            </div>
            <div className="col-span-5">
        <div className="flex">
            <p className="text-xl text-white">Test Collection</p>
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
