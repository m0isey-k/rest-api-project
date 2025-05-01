import Home from "../Pages/Home";
import Details from "./Details";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import NotFound from "../Pages/NotFound";
import Search from "./Search";
import Collection from "./Collection";

const page_routes = [
  { path: '/', page: Home, protected: true },
  { path: '/search/:term', page: Search, protected: true },
  { path: '/:type/:id', page: Details, protected: true },
  { path: '/collection/:collection', page: Collection, protected: true },
  { path: '/login', page: Login, protected: false },
  { path: '/signup', page: SignUp, protected: false },
  { path: '*', page: NotFound },  
];

export default page_routes;

