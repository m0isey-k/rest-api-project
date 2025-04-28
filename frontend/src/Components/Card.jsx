function Card(props){
    return(
        <div className="w-50 rounded-xl overflow-hidden border border-surface-a30" onClick={props.onClick}>
            <img src={props.thumbnail} alt="card picture" className="w-full object-cover border-b border-surface-a30 select-none"/>
            <div className="mx-4 my-2 text-white">
                <p className="font-medium">{props.title}</p>
                <p>{props.authors}</p>
                <p>Rating: {props.rating === 0 ? "N/A" : `${Math.round(props.rating * 10) / 10} / 5`}</p>
            </div>
        </div>
    );
}

export default Card
