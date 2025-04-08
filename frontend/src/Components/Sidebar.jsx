function Sidebar(){
    const sidebarLinks = ['Favorites', 'Books', 'Films', 'Games']

    return(
        <div className="border-r border-primary-a0 mt-12 pt-2 pl-2 h-screen w-1/6 text-surface-a20 select-none">
            {sidebarLinks.map((item, index) => 
            <div className="flex justify-between mr-4 hover:text-white transition cursor-pointer">
                <p key={index}>{item}</p>
                <i class="fa-solid fa-caret-right"></i>
            </div>)}
        </div>
    );
}

export default Sidebar
