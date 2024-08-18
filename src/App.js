import logo from './logo.svg';
import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import commData from '../src/mockCommodityData.json'
import systems from './mockStarSystems.json'
import terminals from './mockTerminals.json'
import MyCargo from './MyCargo';
import { useEffect, useState } from 'react';
import Scripts from './Scripts';

function App() {

  const [commodityData, setCommodityData] = useState()
  const [systemData, setSystemData] = useState()
  const [terminalData, setTerminalData] = useState()
  const [storageTemplate, setStorageTemplate] = useState()

useEffect(() => {
  commData ? setCommodityData(commData.data) : setCommodityData(null)
}, [commData])

useEffect(() => {
  const sysNames = (data) => {
    let sysArray = []

    data.forEach((sys) => {
      sysArray.push(sys.name)
    })
    setSystemData(sysArray)
  }

  systems ? sysNames(systems.data) : setSystemData(null)
}, [systems])


useEffect(() => {
  const sysNames = (data) => {
    let sysArray = []

    data.forEach((sys) => {
      sysArray.push(sys.name)
    })
    setSystemData(sysArray)
  }

  systems ? sysNames(systems.data) : setSystemData(null)
}, [systems])

useEffect(() => {

  const template = {
    CargoRecords : {}
  }

  setStorageTemplate(template)

  const storedData = localStorage.getItem('CargoRecords');

  storedData ? console.log(storedData) : localStorage.setItem('CargoRecords', JSON.stringify(storageTemplate))

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
          {commodityData && systemData && <Route path='spacetrucking/MyCargo' element={<MyCargo systems={systems} systemData={systemData} commData={commodityData}/>}/>}
        </Routes>
    </main>
  );
}

export default App;
