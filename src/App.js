import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import MyCargo from './MyCargo';
import { useEffect, useState } from 'react';
import CargoRecord from './CargoRecord';
import CargoViews from './CargoViews';
import { getData } from './apiCalls';
import Data from './Data';


function App() {

  const [locations, setLocations] = useState()
  const [systems, setSystems] = useState()

  const systemURL = 'https://uexcorp.space/api/2.0/star_systems'

  useEffect(() => {

    getData(systemURL).then(
      data => {
        let array = []
        data.data.forEach((sys) => {array.push({name: sys.name, id: sys.id})})
        setSystems(array)
      }
    )
  }, [])
  
  
  return (
    <main> 
      <header>
        <div className='link-container'>
          <NavLink to='spaceTrucking/Home'>Home</NavLink>
          <NavLink to='spaceTrucking/MyCargo'>My Cargo</NavLink>
        </div>
        <h1 className='site-name'>Space Trucking</h1>
        <div className='header-spacer'>
          EXTERNAL LINKS - WIP
        </div>
      </header>

      <Routes>
        <Route path='spacetrucking/Home' element={<Hauler />}/>
        <Route path='spacetrucking/MyCargo' element={<CargoViews systems={systems}/>}/>
      </Routes>
    </main>
  );
}

export default App;
