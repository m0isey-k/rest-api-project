import Home from "../Pages/Home";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import NotFound from "../Pages/NotFound";

const page_routes = [
  { path: '/', page: Home, layout: 'default', protected: true },
  { path: '/login', page: Login, layout: 'auth', protected: false },
  { path: '/signup', page: SignUp, layout: 'auth', protected: false },
  { path: '*', page: NotFound, layout: '' },  
];

export default page_routes;

