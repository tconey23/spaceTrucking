import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import MyCargo from './MyCargo';
import { useEffect, useState } from 'react';
import CargoRecord from './CargoRecord';
import { getData } from './apiCalls';

function App() {
  
  const [existingRecords, setExistingRecords] = useState();
  const [stations, setStations] = useState();
  const [defaultSystem, setDefaultSystem] = useState(68);
  const [reloadCargo, setReloadCargo] = useState(false)

  const stationUrl = `https://uexcorp.space/api/2.0/space_stations?id_star_system=${defaultSystem}`;

  const handleCargoSubmit = () => {
    setReloadCargo(prev => !prev); 
  };

  useEffect(() => {

    const storedRecords = localStorage.getItem('cargo_records');
    let cargoRecords = [];

    if (storedRecords) {
      try {
        cargoRecords = JSON.parse(storedRecords) || [];
      } catch (error) {
        console.error('Error parsing JSON from localStorage:', error);
        cargoRecords = [];
      }
    }


    getData(stationUrl)
      .then(data => {
        setStations(data.data);

        data.data.forEach(station => {
          const systemIndex = cargoRecords.findIndex(system => system.system.id === station.id_star_system);

          if (systemIndex === -1) {
            cargoRecords.push({
              system: {
                id: station.id_star_system,
                name: station.star_system_name,
                orbits: [],
                moons: [],
                cities: []
              }
            });
          }

          const updatedSystem = cargoRecords.find(system => system.system.id === station.id_star_system);


          if (station.id_orbit) {
            const orbitIndex = updatedSystem.system.orbits.findIndex(orbit => orbit.id === station.id_orbit);
            if (orbitIndex === -1) {
              updatedSystem.system.orbits.push({
                id: station.id_orbit,
                orbit_name: station.orbit_name,
                stored_cargo: []
              });
            }
          }
        });

        localStorage.setItem('cargo_records', JSON.stringify(cargoRecords));


        const array = cargoRecords.map(system => (
          system.system.orbits.map(orbit => (
            orbit.stored_cargo.map(cargo => <CargoRecord key={cargo.id} item={cargo} />)
          ))
        ));
        setExistingRecords(array);

      })
      .catch(error => console.error('Error fetching stations:', error));
  }, [stationUrl]);

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
        <Route path='spacetrucking/MyCargo' element={<MyCargo key={reloadCargo} cargoRecords={existingRecords} onCargoSubmit={handleCargoSubmit}/>}/>
      </Routes>
    </main>
  );
}

export default App;
