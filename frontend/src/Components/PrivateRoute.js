import { Navigate, Outlet } from "react-router-dom";
import Loading from "../Components/Loading";

function PrivateRoute({ component: Component, isLoggedIn, isLoading, ...rest }){
    return isLoggedIn ? (<Outlet/>) : isLoading ? (<div className="h-screen w-full bg-slate-950 flex justify-center items-center"> <Loading/> </div>) : (<Navigate to="/login"/>);
  };

export default PrivateRoute;