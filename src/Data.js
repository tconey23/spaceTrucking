import React, { useState, useEffect } from 'react';

const Data = () => {
  const [systems, setSystems] = useState(null);
  const [planets, setPlanets] = useState(null);
  const [orbits, setOrbits] = useState(null);
  const [cities, setCities] = useState(null);
  const [stations, setStations] = useState(null);

  const dataArray = [
    { endpoint: 'star_systems', stateSetter: setSystems },
    { endpoint: `planets?${systems}`, stateSetter: setPlanets },
    { endpoint: 'orbits', stateSetter: setOrbits },
    { endpoint: 'cities', stateSetter: setCities },
    { endpoint: 'space_stations', stateSetter: setStations },
  ];

  const path = 'https://uexcorp.space/api/2.0/';

  const getData = async (endpoint) => {
    console.log(endpoint)
    try {
      const res = await fetch(`${path}${endpoint}`);
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const fetchData = async (endpoint) => {
    try {
      const data = await getData(endpoint);
      if (data && data.data) {
        const mappedData = data.data.map((dat) => ({
          id: dat.id,
          name: dat.name
        }));
        setSystems(mappedData);
      } else {
        console.error('Data is not in expected format:', data);
      }
    } catch (error) {
      console.error('Error fetching star systems:', error);
    }
  };

  useEffect(() => {
    fetchData('star_systems');
  }, []);

  useEffect(() => {
    if(systems){
        const fetchData = async () => {
            for (const item of systems) {
              const data = await getData(`planets?id_star_system=${item.id}`);
                setPlanets(prev => ({
                    ...prev,
                    ...data.data
                }))
          }; 
        }
        fetchData()
    }
  }, [systems])

  useEffect(() =>{
    if(planets){
        console.log(planets)
    }
  }, [planets])

  return (
    <div>
      {/* <pre>{JSON.stringify(systems, null, 2)}</pre>
      <pre>{JSON.stringify(planets, null, 2)}</pre>
      <pre>{JSON.stringify(orbits, null, 2)}</pre>
      <pre>{JSON.stringify(cities, null, 2)}</pre>
      <pre>{JSON.stringify(stations, null, 2)}</pre> */}
    </div>
  );
};

export default Data;
