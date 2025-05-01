function Sidebar(){
    const sidebarLinks = ['Favorites', 'Books', 'Movies']

    return(
        <div className="border border-primary-a0 text-surface-a30 select-none rounded-xl mx-4 px-4 py-2">
            {sidebarLinks.map((item, index) => 
            <a href={`/collection/${item.toLowerCase()}`}>
            <div key={index} className="flex justify-between my-1 hover:text-white transition cursor-pointer">
                    <p key={index}>{item}</p>
                    <i className="fa-solid fa-caret-right"></i>
            </div>
            </a>
            )}
        </div>
    );
}

export default Sidebar
