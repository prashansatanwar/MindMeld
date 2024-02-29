import { useState, useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom'

import { gapi } from 'gapi-script'
import GoogleLogin, { GoogleLogout } from 'react-google-login'

import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import { userSignup, userlogin } from './Api';
import Analyzer from './Pages/Analyzer';
import { AnalyzeResumeProvider } from './Components/AnalyzeResumeContext';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState();
    let navigate = useNavigate(); 

    useEffect(() => {
        const storedToken = localStorage.getItem('googleAuthToken');
        if(storedToken) {
            setIsLoggedIn(true);
        }
    }, []);

    function start() {
        gapi.client.init({
            clientId: process.env.REACT_APP_CLIENTID,
            scope: ''
        });
        
    };

    useEffect(() => {
        gapi.load('client:auth2',start);
    }, []);

    // Function to retrieve user data from local storage when the component mounts
    const checkUserDataOnMount = () => {
        const userData = localStorage.getItem('userData');
        console.log(localStorage)
        if (userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
        }
    };

    // Call checkUserDataOnMount when your component mounts
    useEffect(() => {
        checkUserDataOnMount();
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
            navigate('/');
        } catch (error) {
            console.error('Error during login/signup:', error);
        }
    }
    

    const handleLogout = () => {
        localStorage.removeItem('googleAuthToken');
        localStorage.removeItem('userData');
        setIsLoggedIn(false);
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
                <button className='uppercase font-bold text-sm py-1 px-2 border-2 border-red-800 rounded bg-red-800 hover:bg-red-900'
                        onClick={renderProps.onClick}
                        >Logout</button>
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
            {!isLoggedIn && <Route exact path='/login' element={<Login GoogleSignInButton={GoogleSignInButton} GoogleSignOutButton={GoogleSignOutButton} isLoggedIn={isLoggedIn} />}/> }
            {isLoggedIn && (
                <>
                    <Route exact path='/' element={<Home user={user} setUser={setUser}/>} />
                    <Route exact path='/analyzer' element={<Analyzer user={user} />} />
                </>
            )}
        </Routes>
      </AnalyzeResumeProvider>
    </div>
  );
}

export default App;
