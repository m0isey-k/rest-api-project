import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import { useState } from "react";
import { change_collection_name } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

function DefaultLayout(props){
    const defaultCollections = ['favorites', 'books', 'movies']
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState(props.title)
    const [sidebarTrigger, setSidebarTrigger] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        if(title && !defaultCollections.includes(title.toLowerCase())){
            await change_collection_name(props.title, title)
            setSidebarTrigger(p => !p)
            navigate(`/collection/${title}`)        
        }
    }
    return(
        <>
        <Header/>
        <div className="mt-16 grid grid-cols-6 gap-8">
            <div className="col-span-1">
                <div className="sticky top-16">
                    <Sidebar newCollection={props.newCollection} updateTrigger={sidebarTrigger}/>
                </div>
            </div>
            <div className="col-span-5">
                <div className="flex">
                    {isEditing ? 
                    <form onSubmit={handleSubmit}>
                        <input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onBlur={() => setIsEditing(false)}
                            autoFocus
                            className="text-white text-xl outline-none border-b"
                            style={{ width: `${title.length}ch`, minWidth: '1ch' }}
                        />
                    </form>
                    :    
                    <p className="text-xl text-white">{title}</p>
                    }
                    {(defaultCollections.includes(props.title) || !location.pathname.startsWith('/collection/')) ? '' :
                    <i className="fa-solid fa-pen-to-square my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer" onClick={() => setIsEditing(true)}></i>
                        } 
                </div>
                {props.content}
            </div>
        </div>
        </>
    )
}

export default DefaultLayout 

