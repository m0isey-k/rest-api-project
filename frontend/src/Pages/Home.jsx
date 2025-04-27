import DefaultLayout from "./DefaultLayout";

function Home(){
    return(
        <>
        <DefaultLayout title="Home" content={
        <div className="mt-4 flex flex-wrap items-start gap-8">
            <p className="text-white text-xl">Search for something</p>
        </div>
        } />
        </>
    )
}

export default Home
