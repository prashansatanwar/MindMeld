import { useState, useEffect } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom'

import { gapi } from 'gapi-script'
import GoogleLogin, { GoogleLogout } from 'react-google-login'

import './App.css';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Navbar from './Components/Navbar';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState();

    let navigate = useNavigate(); 
      const routeChange = () =>{ 
        let path = `newPath`; 
        navigate(path);
    }

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

    const responseSuccess = (response) => {
        const { profileObj, tokenId } = response;
        localStorage.setItem('googleAuthToken', tokenId);
        setIsLoggedIn(true);
        console.log(`Welcome, ${profileObj.name}`);
        console.log(profileObj);
        setUser(profileObj);
        navigate('/');
    }

    const responseFailure = (response) => {
        console.log("Login not successful");
        console.log(response);
    }

    const handleLogout = () => {
        localStorage.removeItem('googleAuthToken');
        setIsLoggedIn(false);
        console.log(localStorage);
        navigate('/login')
    };

    const GoogleSignInButton = () => {
      return (
          <GoogleLogin
              clientId={process.env.REACT_APP_CLIENTID}
              buttonText='Sign in with Google'
              onSuccess={responseSuccess}
              onFailure={responseFailure}
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
          <Route exact path='/' element={<Home/>}/>
        )}
      </Routes>
    </div>
  );
}

export default App;
