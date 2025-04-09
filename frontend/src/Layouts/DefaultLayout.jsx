import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

function DefaultLayout({ children }) {
  return (
      <div>
        <Header />
        <div className="mt-16 grid grid-cols-6 gap-8">
            <div className="col-span-1">
                <div className="sticky top-16">
                    <Sidebar />
                </div>
            </div>
            <div className="col-span-5">
                {children}
            </div>
        </div>
      </div>
  );
}
export default DefaultLayout;
