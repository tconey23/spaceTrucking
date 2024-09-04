import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import CargoViews from './CargoViews';
import { getData } from './apiCalls';
import Fleet from './Fleet';
import { initializeApp } from 'firebase/app';
import "firebase/auth";
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Login from './Login';
import { useNavigate, useLocation } from 'react-router-dom';

function App() {
  const [locations, setLocations] = useState();
  const [systems, setSystems] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const logRef = useRef();
  const location = useLocation()

  const systemURL = 'https://uexcorp.space/api/2.0/star_systems';

  useEffect(() => {
    getData(systemURL).then(
      data => {
        let array = [];
        data && data.data.forEach((sys) => array.push({ name: sys.name, id: sys.id }));
        setSystems(array);
      }
    );
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
          user.getIdToken().then((idToken) => {
            setToken(idToken);
          });
        })
        .catch((error) => {
          console.error('Error signing in:', error);
        });
    }
  }, [credentials]);

  useEffect(() => {
    if (token) {
      setLoggedIn(true);
      navigate('/home')
    } else if (!loggedIn) {
      navigate('login');
    }
    console.log(loggedIn)
  }, [token, loggedIn]);

  useEffect(() => {
    console.log(location.pathname)
  }, [location])

  const handleLogout = async () => {
    try {
      await signOut(auth); // Use the `signOut` function from Firebase Auth
      console.log("User signed out successfully");
      
      setCredentials(null); // Clear credentials
      setToken(null); // Clear token
      setLoggedIn(false); // Set loggedIn to false

      navigate('/login'); // Redirect to login page
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  
  return (
    <main> 
      <aside></aside>
      <header>
        <div className='link-container'>
          {!loggedIn && <NavLink ref={logRef} className='login' to='/login'>
            <i class="fi fi-bs-power"></i>
          </NavLink>}
          {loggedIn && <NavLink ref={logRef}  className='logout' to='' onClick={handleLogout}>
            <i class="fi fi-bs-power"></i>  
          </NavLink>}
          {location.pathname !== '/home' && <NavLink className='home' to='/home'>
            <i class="fi fi-sr-home"></i>
            </NavLink>}
          {location.pathname !== '/mycargo' && <NavLink className='cargo' to='/mycargo'>
            <i class="fi fi-br-forklift"></i>
          </NavLink>}
          {location.pathname !== '/myfleet' && <NavLink className='fleet' to='/myfleet'>
            <i class="fi fi-sr-garage-car"></i>
          </NavLink>}
        </div>
        <h1 className='site-name'>Space Trucking</h1>
        <div className='header-spacer'>
          EXTERNAL LINKS - WIP
        </div>
      </header>

      <Routes>
        {loggedIn && token ? (
          <>
            <Route path='' element={<Hauler />} />
            <Route path='/home' element={<Hauler />} />
            <Route path='/mycargo' element={<CargoViews token={token} systems={systems} />} />
            <Route path='/myfleet' element={<Fleet token={token} />} />
          </>
        ) : (
          <Route path='login' element={<Login setCredentials={setCredentials} />} />
        )}
      </Routes>
    </main>
  );
}

export default App;
