import React, { useMemo, useState, useEffect } from 'react'
import terminals from './mockTerminals.json'
import systems from './mockStarSystems.json'
import { getData } from './apiCalls'

const Terminals = ({ systemData }) => {
  const [selectedSystem, setSelectedSystem] = useState('')
  const [orbits, setOrbits] = useState()
  const [orbitList, setOrbitList] = useState()
  const [selectedOrbit, setSelectedOrbit] = useState('')
  const [isMoon, setIsMoon] = useState(false)
  const [isOrbit, setIsOrbit] = useState(false) 
  const [moons, setMoons] = useState()
  const [station, setStation] = useState()
  const [stations, setStations] = useState()
  const [selectedStation, setSelectedStation] = useState('')
  const [defaultSystem, setDefaultSystem] = useState()
  const [selectedMoon, setSelectedMoon] = useState('')
  const [readyToSubmit, setReadyToSubmit] = useState(false)
  const [dataToAdd, setDataToAdd] = useState({})

  const systemOptions = useMemo(() => {
    return systemData.map((sys) => (
      <option key={sys} value={sys}>
        {sys}
      </option>
    ))
  }, [systemData])

  const systemFilter = (e) => {
    let selectedValue
    !e==='Stanton' ? selectedValue = e.target.value : selectedValue = 'Stanton'
    setSelectedSystem(selectedValue)

   const sysTerms = terminals.data.filter((term) => 
        term.star_system_name === selectedValue
    )

    const sysId = systems.data.find((sys) => sys.name === selectedValue).id

    getOrbits(sysId).then(orbits => {
        setOrbits(orbits.data)
    })
  }

  const getOrbits = async (data) => {
    return await getData(`https://uexcorp.space/api/2.0/orbits?id_star_system=${data}`)
  }

  const listOrbits = (data) => {
    let orbArray = []

    data.forEach((orb) => {
        orbArray.push(<option>{orb.name}</option>)
    })
    setOrbitList(orbArray)
  }

  const listTerminals = (e) => {
    const selectedValue = e.target.value
    setSelectedOrbit(selectedValue)
  }

  const orbitOrMoon = (data) => {
    data.includes(' ') ? getOrbit(data) : getMoon(data)
  }

  const getMoon = (data) => {
    setIsMoon(true)
    setIsOrbit(false)

    let moons = []
    let cleanedMoons = []

    const findMoon = terminals.data.filter((term) => term.planet_name === data)
    findMoon.forEach((moon) => {
        moon.moon_name != null ? moons.push(moon.moon_name) : console.log('')
    })

    new Set(moons).forEach((moon) => {
      cleanedMoons.push(<option>{moon}</option>)
    })

    setMoons(cleanedMoons)

  }

  const getOrbit = (data) => {
    setIsMoon(false)
    setIsOrbit(true)
    const findStation = terminals.data.find((term) => term.orbit_name === data).space_station_name
    findStation ? setStations(<option>{findStation}</option>) : console.log('no station')
  }

  const selectMoon = (e) => {
    const selectedValue = e.target.value
    setSelectedMoon(selectedValue)

    let stations=[]

    const findStations = terminals.data.filter((stat) => stat.moon_name === selectedValue)

    findStations.forEach((stat) => {
      stations.push(<option>{stat.name}</option>)
    })

    setStations(stations)
  }

  const selectStation = (e) => {
    const selectedValue = e.target.value
    setSelectedStation(selectedValue)
  }

  const addLine = (e) => {
    const stationData = {
      System: selectedSystem,
      Orbit: selectedOrbit,
      Moon: selectedMoon,
      Station: selectedStation
    }

    setDataToAdd(stationData)

    setSelectedMoon('')
    setSelectedOrbit('')
    setSelectedSystem('')
    setSelectedStation('')
    setOrbitList('')
    setMoons('')
    setStations('')
    setIsMoon(false)

    console.log(stationData)
  }

  useEffect(() => {
    orbits ? listOrbits(orbits) : console.log('no orbits')
  }, [orbits])

  useEffect(() => {
    selectedOrbit ? orbitOrMoon(selectedOrbit) : console.log('no selection')
  }, [selectedOrbit])

  useEffect(() => {
    selectedStation ? setReadyToSubmit(true) : setReadyToSubmit(false)
  }, [selectedStation])

useEffect(() => {
    setTimeout(() => {
        setDefaultSystem('Stanton')
        setSelectedSystem('Stanton')
        systemFilter('Stanton')
    }, 1000);
    
}, [])

  return (
    <div>
      <select value={selectedSystem} onChange={systemFilter}>
        <option value={defaultSystem}>
          {defaultSystem}
        </option>
        {systemOptions}
      </select>

    { orbitList && 
        <select value={selectedOrbit} onChange={listTerminals}>
            <option value='' disabled>
                Select an orbit
            </option>
        {orbitList}
        </select>
    }

    { isMoon && 
        <select value={selectedMoon} onChange={selectMoon}>
            <option value='' disabled>
                Select a moon
            </option>
        {moons}
        </select>
    }

{ stations && 
        <select value={selectedStation} onChange={selectStation}>
            <option value='' disabled>
                Select a station
            </option>
        {stations}
        </select>
    }

{ readyToSubmit && 
        <a onClick={(e) => addLine(e)}>
          +
        </a>
    }

    </div>
  )
}

export default Terminals
