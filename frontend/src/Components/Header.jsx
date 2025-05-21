import { useState, useRef, useEffect } from 'react';
import { logout } from '../api';
import { useNavigate } from 'react-router-dom';

function Header(){
    const [term, setTerm] = useState("")
    const navigate = useNavigate()
    const dropdownItems = ['Favorites', 'Books', 'Movies']
    const dropdownIcons = ['bookmark', 'book', 'film']

    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef(null)
    const buttonRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target)
            ) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const handleLogout = async () => {
        try {
            await logout()
            navigate('/login')
        } catch(e) {
            console.error(e)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(term) {
            navigate(`/search/${term}`) 
            setTerm("")
        }
    }
    return(
        <>
        <div>
        <nav className="border-b-1 bg-surface-a0 border-primary-a0 fixed top-0 w-full z-50 select-none">
            <div className="px-5 flex flex-wrap items-center justify-between mx-auto h-12"> 
                <a href="https://github.com/m0isey-k/rest-api-project" target="_blank"><i className="fa-brands fa-github text-3xl text-white"></i></a>
                <form onSubmit={handleSubmit} className="flex items-center max-w-sm w-80">   
                    <div className="relative w-full">
                        <input
                            type="text"
                            value={term}
                            onChange={(e) => setTerm(e.target.value)}
                            className="bg-surface-a20 h-8 text-white placeholder-neutral-400 rounded-full block w-full p-3  shadow-[0_0_1px_1px] shadow-primary-a0 hover:shadow-[0_0_5px_1px] focus:shadow-[0_0_5px_1px] duration-150 focus:outline-none selection:bg-surface-a50"
                            placeholder="Search..."
                        />
                    </div>
                </form>
                <div className="flex">
                    <p ref={buttonRef} className="text-white mr-5 cursor-pointer" onClick={() => setDropdownOpen((p) => !p)}>Library<i className="fa-solid fa-caret-down ml-2"></i></p>
                    <div ref={dropdownRef}
                        className={`absolute right-16 top-14 shadow-[0_0_1px_1px] shadow-primary-a0 rounded-lg bg-surface-a10 transition ${dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                        <ul className="text-surface-a50 py-2">
                        {dropdownItems.map((item, index) =>
                            <li key={index} className={`px-6 py-2 text-sm  hover:text-white transition`}>
                            <a href={`/collection/${item.toLowerCase()}`}>
                            <i className={`fa-solid fa-${dropdownIcons[index]} pr-2`}></i>
                            {item} 
                            </a>
                            </li>
                        )}
                            <li className={`px-6 py-2 text-sm  hover:text-white transition`}>
                                <p onClick={handleLogout}>
                                <i className="fa-solid fa-right-from-bracket pr-2"></i>
                                Logout</p>
                            </li>
                        </ul>
                    </div>
                    <a href="/" className="text-white cursor-pointer font-medium">Home</a>
                </div>
            </div>
        </nav>
        </div>
        </>
    );
}

export default Header
