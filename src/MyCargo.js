import React from 'react'
import { getData } from './apiCalls'
import { useState, useEffect } from 'react'
import Systems from './Systems'

const MyCargo = () => {

  const systems = 'https://uexcorp.space/api/2.0/star_systems'

  const [systemList, setSystemList] = useState()
  const [storageData, SetStorageData] = useState()
  const [selectedSystem, setSelectedSystem] = useState('defaultOption')
  const [systemOpt, setSystemOpt] = useState()
  const [selectedOption, setSelectedOption] = useState("defaultOption");

  const handleChange = (event) => {
    setSelectedSystem({
      name: event.target.value, 
      id: event.target.key
    })
  }

  const importData = () => {

    getData(systems).then(
       data => {
           setSystemList(data.data)
       }
    )
   
   }

   useEffect(() => {
      importData()
   }, [])

   useEffect(() => {
    let exit

    const systemOptions = (data) => {
      let array = []
      data.forEach((sys) => {
        array.push(<option key={sys.code} value={sys.name}>{sys.name}</option>)
      })
      return array
    }
    systemList ? setSystemOpt(systemOptions(systemList)) : exit = null

   }, [systemList])


  return (
    <>
    <p>Add System +</p>
    <div className='new-system'>
      <select value={selectedSystem} onChange={handleChange}>
      <option value="defaultOption" disabled>Select a system</option>
        {systemOpt}
      </select>
    </div>
      <Systems system={{name: 'Stanton', id: 68}}/>
      {!selectedSystem === 'defaultOption' && <Systems system={selectedSystem}/>}
    </>
  )
}

export default MyCargo
