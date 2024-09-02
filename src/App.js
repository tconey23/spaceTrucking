import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import MyCargo from './MyCargo';
import { useEffect, useState } from 'react';
import CargoRecord from './CargoRecord';
import CargoViews from './CargoViews';
import { getData } from './apiCalls';
import Data from './Data';
import Fleet from './Fleet';
import HoloTest from './HoloTest';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Login from './Login';


function App() {

  const [locations, setLocations] = useState()
  const [systems, setSystems] = useState()
  const [loggedIn, setLoggedIn] = useState(false)
  const [credentials, setCredentials] = useState(null)
  const [token, setToken] = useState()

  const systemURL = 'https://uexcorp.space/api/2.0/star_systems'

  useEffect(() => {

    getData(systemURL).then(
      data => {
        let array = []
        data && data.data.forEach((sys) => {array.push({name: sys.name, id: sys.id})})
        setSystems(array)
      }
    )
  }, [])

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

    if(credentials){
      console.log(credentials)
      signInWithEmailAndPassword(auth, credentials[0], credentials[1])
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    
    // Get the ID token
    user.getIdToken().then((idToken) => {
      setToken(idToken)
      // You can now send this ID token in the Authorization header of your requests
    });
  })
  .catch((error) => {
    console.error('Error signing in:', error);
  });
    }

  }, [credentials])

  useEffect(() => {
    token && setLoggedIn(true)
    console.log(token, loggedIn)
  }, [token])
  
  return (
    <main> 
      <aside>
        
      </aside>
      <header>
        <div className='link-container'>
          <NavLink to='spaceTrucking/Home'>Home</NavLink>
          <NavLink to='spaceTrucking/MyCargo'>My Cargo</NavLink>
          <NavLink to='spaceTrucking/MyFleet'>My Fleet</NavLink>
        </div>
        <h1 className='site-name'>Space Trucking</h1>
        <div className='header-spacer'>
          EXTERNAL LINKS - WIP
        </div>
      </header>

      <Routes>
        {loggedIn && token ? 
        <>
        <Route path='' element={<Hauler />}/> 
        <Route path='spacetrucking/Home' element={<Hauler />}/>
        <Route path='spacetrucking/MyCargo' element={<CargoViews token={token} systems={systems}/>}/>
        <Route path='spacetrucking/MyFleet' element={<Fleet token={token}/>}/>
        </>
        :
        <Route path='' element={<Login setCredentials={setCredentials}/>}/>
      }
      </Routes>
    </main>
  );
}

export default App;
