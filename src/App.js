import './App.css';
import Hauler from './Hauler';
import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';
import CargoViews from './CargoViews';
import { getData } from './apiCalls';
import Fleet from './Fleet';
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { getAuth, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile, auth } from 'firebase/auth';
import Login from './Login';
import { useNavigate, useLocation } from 'react-router-dom';
import { GlobalContext } from './GlobalContext';
import SideBar from './SideBar';

function App() {
  const [locations, setLocations] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [logOut, setLogout] = useState(false)
  const [credentials, setCredentials] = useState(null);
  const [token, setToken] = useState();
  const [toggleSideBar, setToggleSideBar] = useState(false)
  const navigate = useNavigate();
  const logRef = useRef();
  const location = useLocation();
  const [displayName, setDisplayName] = useState('')
  const { devProd } = useContext(GlobalContext);

  const systemURL = 'https://uexcorp.space/api/2.0/star_systems';

  useEffect(() => {
    // Fetch star systems data on initial render
    getData(systemURL).then((data) => {
      if (data && data.data) {
        const systemsArray = data.data.map((sys) => ({ name: sys.name, id: sys.id }));
        setSystems(systemsArray);
      }
    });
    


  }, []);

  const firebaseConfig = {
    apiKey: "AIzaSyDcB7JThnCpbvnrf8qEgLCFW4UCd2qQStw",
    authDomain: "spacetrucking-d218d.firebaseapp.com",
    projectId: "spacetrucking-d218d",
    storageBucket: "spacetrucking-d218d.appspot.com",
    messagingSenderId: "535279723185",
    appId: "1:535279723185:web:4a97254648a3d2d7e33890",
    measurementId: "G-3S81V95XWS"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    if (credentials) {
      signInWithEmailAndPassword(auth, credentials[0], credentials[1])
        .then((userCredential) => {
          const user = userCredential.user;
          return user.getIdToken();
        })
        .then((idToken) => {
          setToken(idToken);
        })
        .catch((error) => {
          console.error('Error signing in:', error);
        });
    }
  }, [credentials, auth]);

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      const user = auth.currentUser;
      if (user) {
        const displayName = user.displayName;
        setDisplayName(displayName);
      }
    } else if (!loggedIn) {
    }
  }, [token, loggedIn, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      setCredentials(null);
      setToken(null);
      setLoggedIn(false);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const createAccount = (email, password, fltydUser) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User created: ", user);
  
        // Update the user's profile with the Fleetyards username (fltydUser)
        return updateProfile(user, {
          displayName: fltydUser, // Set the Fleetyards username as the display name
        });
      })
      .then(() => {
        console.log("User profile updated with Fleetyards username.");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(`Error (${errorCode}): ${errorMessage}`);
      });
  };


  return (
    <main>
      <aside></aside>
      <header>
        <i onClick={() => setToggleSideBar(prev => prev === false ? true : false)} className="fi fi-sr-sidebar-flip"></i>
        <h1 className="site-name">Space Trucking</h1>
        <div className="header-spacer">EXTERNAL LINKS - WIP</div>
      </header>
      <SideBar displayName={displayName} credentials={credentials} setToggleSideBar={setToggleSideBar} loggedIn={loggedIn} logRef={logRef} location={location} handleLogout={handleLogout} toggleSideBar={toggleSideBar}/>
      <Routes>
        {loggedIn && token ? (
          <>
            <Route path="" element={<Hauler />} />
            <Route path="/home" element={<Hauler />} />
            <Route path="/mycargo" element={<CargoViews token={token} systems={systems} />} />
            <Route path="/myfleet" element={<Fleet token={token} />} />
          </>
        ) : (
          <Route path="login" element={<Login setCredentials={setCredentials} create={createAccount}/>} token={token}/>
        )}
      </Routes>
    </main>
  );
}

export default App;
