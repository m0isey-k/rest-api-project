import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import NotFound from "../Pages/NotFound";

const page_routes = [
  { path: '/', page: Home, protected: true },
  { path: '/login', page: Login, protected: false },
  { path: '/signup', page: SignUp, protected: false },
  { path: '*', page: NotFound },  
];

export default page_routes;

