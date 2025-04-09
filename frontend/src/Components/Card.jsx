import pfp from "../assets/cats/cat_pfp_6.jpg"

function Card(){
    return(
        <div className="w-50 rounded-xl overflow-hidden border border-surface-a30">
            <img src={pfp} alt="profile picture" className="object-cover border-b border-surface-a30 select-none"/>
            <div className="mx-4 my-2 text-white">
                <p>Name: Lorem Ipsum</p>
                <p>Rating: *****</p>
                <p>Date: 09.04.2025</p>
            </div>
        </div>
    );
}

export default Card
