import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom'

import { gapi } from 'gapi-script'
import GoogleLogin, { GoogleLogout } from '@leecheuk/react-google-login'

import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import { userSignup, userlogin } from './Api';
import Analyzer from './Pages/Analyzer';
import { AnalyzeResumeProvider } from './Components/AnalyzeResumeContext';
import PrivateRoute from './Components/PrivateRoute';
import PageNotFound from './Pages/PageNotFound';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();
    let navigate = useNavigate(); 

    function start() {
        gapi.client.init({
            clientId: process.env.REACT_APP_CLIENTID,
            scope: ''
        });
        
    };
    
    useEffect(() => {
        const storedToken = localStorage.getItem('googleAuthToken');
        const userData = localStorage.getItem('userData');
        console.log(localStorage)
        if(storedToken && userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
        }
        setIsLoading(false);
        gapi.load('client:auth2',start);
    }, []);


    async function handleLogin(response) {
        const { profileObj, tokenId } = response;
    
        try {
            let userData = await userlogin(profileObj.googleId);
            
            if (!userData.message) {
                setUser(userData);
                localStorage.setItem('userData',JSON.stringify(userData));
            } else {
                let signupData = await userSignup(profileObj);
                if (signupData) {
                    userData = await userlogin(profileObj.googleId);
                    setUser(userData);
                    localStorage.setItem('userData',JSON.stringify(userData));
                }
            }
            localStorage.setItem('googleAuthToken', tokenId);
            setIsLoggedIn(true);
            setIsLoading(false);
            navigate('/');
        } catch (error) {
            console.error('Error during login/signup:', error);
        }
    }
    

    const handleLogout = () => {
        localStorage.removeItem('googleAuthToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
        setIsLoading(false);
        console.log(localStorage);
        navigate('/login')
    };

    const GoogleSignInButton = () => {
      return (
          <GoogleLogin
              clientId={process.env.REACT_APP_CLIENTID}
              buttonText='Sign in with Google'
              onSuccess={handleLogin}
              onFailure={handleLogin}
              cookiePolicy={'single_host_origin'}
          />
      );
  }

  const GoogleSignOutButton = () => {
      return (
          <GoogleLogout
            render={renderProps => (
                <button className='uppercase font-bold text-xs sm:text-sm md:text-base p-1 md:px-2 border-2 border-red-800 rounded bg-red-800 hover:bg-red-900'
                        onClick={renderProps.onClick}>
                    Logout
                </button>
            )}
            clientId={process.env.REACT_APP_CLIENTID}
            onLogoutSuccess={handleLogout}
            isSignedIn={isLoggedIn}
          />
      );
  }

  return (  
    <div className="font-mono">
      {isLoggedIn && <Navbar GoogleSignOutButton={GoogleSignOutButton} />}
      <AnalyzeResumeProvider>
        <Routes>
            <Route exact path='/' element={<PrivateRoute isLoggedIn={isLoggedIn} isLoading={isLoading} component={Home}/>}>
                <Route exact path='/' element={<Home user={user} setUser={setUser}/>}/>
            </Route>

            <Route exact path='/analyzer' element={<PrivateRoute isLoggedIn={isLoggedIn} isLoading={isLoading} component={Home}/>}>
                <Route exact path='/analyzer' element={<Analyzer user={user}/>}/>
            </Route>

            <Route
                path='/login'
                element={
                isLoggedIn ? (
                    <Navigate to="/" />
                ) : (
                    <Login GoogleSignInButton={GoogleSignInButton} GoogleSignOutButton={GoogleSignOutButton} isLoggedIn={isLoggedIn} />
                )
                }
            />
          
          <Route exact path='*' element={<PrivateRoute isLoggedIn={isLoggedIn} isLoading={isLoading} component={PageNotFound}/>}>
                <Route path='*' element={<PageNotFound />} />
            </Route>
        </Routes>
      </AnalyzeResumeProvider>
    </div>
  );
}

export default App;
