import Card from "../Components/Card";

function Home(){
    const cards = []
    for(let i = 0; i < 20; i++) {
        cards.push(<Card key={i}/>)
    }
    return(
        <>
        <div className="flex">
            <p className="text-xl text-white">Test Collection</p>
            <i className="fa-solid fa-bars my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer"></i>
        </div>
        <div className="mt-4 flex flex-wrap gap-8">
            {cards}
        </div>
        </>
    )
}

export default Home
