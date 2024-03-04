import { Navigate, Outlet } from "react-router-dom";
import Loading from "../Pages/Loading";

function PrivateRoute({ component: Component, isLoggedIn, isLoading, ...rest }){
    return isLoggedIn ? (<Outlet/>) : isLoading ? (<Loading/>) : (<Navigate to="/login"/>);
  };

export default PrivateRoute;