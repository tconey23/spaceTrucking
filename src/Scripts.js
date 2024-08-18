import React from 'react'
import { getData } from "./apiCalls";

const Scripts = () => {

const systems = 'https://uexcorp.space/api/2.0/star_systems'
const orbits = 'https://uexcorp.space/api/2.0/orbits'
const moons = 'https://uexcorp.space/api/2.0/moons'
const planets = 'https://uexcorp.space/api/2.0/planets'

const locationData = {
    systems: '',
    orbits: '',
    moons: '',
    stations: '',
    planets: ''
}

const importData = () => {
 getData(systems).then(
    data => {
        locationData.systems = data.data
        console.log(locationData.systems)
    }
 )

}

  return (
    <div>
      
    </div>
  )
}

export default Scripts


