function Card(props){
    const stars = []
    for(let i = 0; i < 4; i++) {
        stars.push(<i className="fa-solid fa-star" key={i}></i>)
    }
    stars.push(<i className="fa-regular fa-star" key="5"></i>) // TEST
    return(
        <div className="w-50 rounded-xl overflow-hidden border border-surface-a30">
            <img src={props.thumbnail} alt="card picture" className="w-full object-cover border-b border-surface-a30 select-none"/>
            <div className="mx-4 my-2 text-white">
                <p className="font-medium">{props.title}</p>
                <div className="flex">
                    <p>Rating: </p>
                    <div className="my-auto ml-2 text-sm">
                    {stars}
                    </div>
                </div>
                <p>Date: 09.04.2025</p>
            </div>
        </div>
    );
}

export default Card
