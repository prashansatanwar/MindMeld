import { useState, useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom'

import { gapi } from 'gapi-script'
import GoogleLogin, { GoogleLogout } from 'react-google-login'

import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';
import { userSignup, userlogin } from './Api';
import Dashboard from './Pages/Dashboard';

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
              clientId={process.env.REACT_APP_CLIENTID}
              buttonText='LogOut'
              onLogoutSuccess={handleLogout}
              isSignedIn={isLoggedIn}
          />
      );
  }


  return (  
    <div className="App">
      {isLoggedIn && <Navbar GoogleSignOutButton={GoogleSignOutButton} />}
      <Routes>
        {!isLoggedIn && <Route exact path='/login' element={<Login GoogleSignInButton={GoogleSignInButton} GoogleSignOutButton={GoogleSignOutButton} isLoggedIn={isLoggedIn} />}/> }
        {isLoggedIn && (
            <>
                <Route exact path='/' element={<Home />} />
                <Route exact path='/dashboard' element={<Dashboard user={user} />} />
            </>
        )}
      </Routes>
    </div>
  );
}

export default App;
