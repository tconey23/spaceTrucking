import React from 'react'
import { getData } from './apiCalls'
import { useState, useEffect } from 'react'

const Systems = ({system}) => {

    console.log(system)

const orbits = 'https://uexcorp.space/api/2.0/orbits'
const moons = 'https://uexcorp.space/api/2.0/moons'
const planets = 'https://uexcorp.space/api/2.0/planets'

    const [selectedOption, setSelectedOption] = useState('defaultOption')
    const [selectedType, setSelectedType] = useState()
    const [optionsList, setOptionsList] = useState()
    const [typeSelection, setTypeSelection] = useState('defaultOption')

    const importData = (data) => {

        getData(data).then(
           data => {
               setSelectedType(data.data)
           }
        )
       
       }
    
       useEffect(() => {
        let exit
        const listOptions = () => {
            let array = []
            selectedType.forEach((type) => {
                array.push(<option key={type.id} id={type.id} value={type.name}>{type.name}</option>)
            })

            return array
        }
        selectedType ? setOptionsList(listOptions) : exit = null


       }, [selectedType])

       useEffect(() => {
        let exit
            typeSelection ? console.log(typeSelection) : exit = null
       }, [typeSelection])

       useEffect(() => {
        switch (selectedOption) {
            case 'moons': importData(`https://uexcorp.space/api/2.0/moons?id_star_system=${system.id}`)
                break;
            case 'orbits': importData(`https://uexcorp.space/api/2.0/orbits?id_star_system=${system.id}`)
                break;
            case 'planets': importData(`https://uexcorp.space/api/2.0/planets?id_star_system=${system.id}`)
                break;
            default:
                break;
        }
       }, [selectedOption])

       const changeOption = (e) => {
            setSelectedOption(e.target.value)
       }

       const changeType = (e) => {
        console.log(e.target.key)
        setTypeSelection({type: selectedOption, name: e.target.value, id: e.target.id})
   }

  return (
    <div className='system-wrapper'>
        <h2 className='system-name'>{system.name}</h2>
        <select value={selectedOption} onChange={changeOption}>
            <option value='defaultOption' disabled>Select an option</option>
            <option value='moons'>Moon</option>
            <option value='orbits'>Orbit</option>
            <option value='planets'>Planet</option>
        </select>

        {optionsList && 
            <select value={typeSelection} onChange={changeType}>
            <option value='defaultOption' disabled>Select an option</option>
                {optionsList}
            </select>
        }
    </div>
  )
}

export default Systems
