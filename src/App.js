import logo from './logo.svg';
import './App.css';
import Hauler from './Hauler'; 
import { Routes, Route, NavLink } from 'react-router-dom';
import commodities from '../src/mockCommodityData.json'
import systems from './mockStarSystems.json'
import terminals from './mockTerminals.json'
import MyCargo from './MyCargo';
import { useEffect, useState } from 'react';
import Scripts from './Scripts';
import CargoRecord from './CargoRecord';

function App() {

  const [commodityData, setCommodityData] = useState()
  const [systemData, setSystemData] = useState()
  const [terminalData, setTerminalData] = useState()
  const [storageTemplate, setStorageTemplate] = useState()
  const [existingRecords,setExistingRecords] = useState()

useEffect(() => {
  setCommodityData(commodities.data) 
}, [])

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
    cargo_records : []
  }

  setStorageTemplate(template)

  const storedData = JSON.parse(localStorage.getItem('cargo_records')) || [];

  const displayRecords = () => {
    let array = []
    console.log(storedData)
    storedData.forEach((item) => {
      array.push(<CargoRecord item={item}/>)
    })
    setExistingRecords(array)
  }

  storedData !== 'undefined' ? displayRecords() : localStorage.setItem('cargo_records', JSON.stringify(storageTemplate))

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
          {commodityData && systemData && <Route path='spacetrucking/MyCargo' element={<MyCargo systems={systems} systemData={systemData} commData={commodityData} existingRecords={existingRecords}/>}/>}
        </Routes>
    </main>
  );
}

export default App;
