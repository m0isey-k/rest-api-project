function Sidebar(){
    const sidebarLinks = ['Favorites', 'Books', 'Films', 'Games']

    return(
        <div className="border border-primary-a0 text-surface-a30 select-none rounded-xl mx-4 px-4 py-2">
            {sidebarLinks.map((item, index) => 
            <div key={index} className="flex justify-between my-1 hover:text-white transition cursor-pointer">
                <p key={index}>{item}</p>
                <i className="fa-solid fa-caret-right"></i>
            </div>)}
        </div>
    );
}

export default Sidebar
