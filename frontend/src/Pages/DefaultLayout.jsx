import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

function DefaultLayout(props){
    return(
        <>
        <Header/>
        <div className="mt-16 grid grid-cols-6 gap-8">
            <div className="col-span-1">
                <div className="sticky top-16">
                    <Sidebar />
                </div>
            </div>
            <div className="col-span-5">
                <div className="flex">
                    <p className="text-xl text-white">{props.title}</p>
                    <i className="fa-solid fa-bars my-auto ml-2 text-surface-a20 hover:text-white transition cursor-pointer"></i>
                </div>
                {props.content}
            </div>
        </div>
        </>
    )
}

export default DefaultLayout 

