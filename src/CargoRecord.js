import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';

const CargoRecord = ({ planet, system, orbit, station, token, setKeyId }) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [inventory, setInventory] = useState([]);
  const [document] = useState('cargo_records');
  const [toggleGrid, setToggleGrid] = useState(false)
  const [commKey, setCommKey] = useState(4)
  
  const prod = 'https://space-trucking-backend-2d499135d3db.herokuapp.com/';
  const dev = 'http://localhost:3001/';
  const [devProd] = useState(prod);
  
  const fetchCargoRecords = async () => {
    try {
      const response = await fetch(`${devProd}cargo`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const records = await response.json();

        if (Array.isArray(records)) {
          setStoredCargo(records);

          const matchedInventory = records.filter(
            (rec) =>
              rec.orbit.name.toLowerCase() === orbit.name.toLowerCase() &&
              rec.planet.name.toLowerCase() === planet.name.toLowerCase() &&
              rec.system.name.toLowerCase() === system.name.toLowerCase()
          );

          setInventory(matchedInventory.flatMap((rec) => rec.cargo));
        } else {
          console.error('Expected an array but got:', typeof records);
        }
      } else {
        console.error('Failed to fetch cargo records:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching cargo records:', error);
    }
  };
  useEffect(() => {
  
    fetchCargoRecords();
  }, [system, planet, orbit, station, token]);

  useEffect(() => {
    if (commData && commData.data) {
      const sortedComms = [...new Set(commData.data.map(comm => comm.commodity_name).sort())];
      const options = sortedComms.map((comm, index) => (
        <option key={index} value={comm}>{comm}</option>
      ));
      setCommsList(options);
    }
  }, []);

  const handleChange = (e) => {
    setScuValue(e.target.value);
  };

  const selectComm = (e) => {
    setCommodity(e.target.value);
  };



  const addCommodity = async (type, id = null, scu, comm) => {
    if (type === 'add' && (!commodity || !scuValue)) {
      alert("Please select a commodity and enter a valid SCU value.");
      return;
    }
  
    if (type === 'add') {
      const newCargoItem = { id: Date.now(), commodity, scu: scuValue };
  
      try {
        const response = await fetch(`${devProd}add-cargo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            system,
            planet,
            orbit,
            station,
            cargo: newCargoItem,
          }),
        });
  
        if (response.ok) {
          const updatedRecords = await response.json(); // Get updated cargo records from the backend
  
          // Update the front-end with the new records from the backend
          setStoredCargo(updatedRecords);
  
          // Filter and set the inventory for the current location
          const matchedInventory = updatedRecords.filter(
            (rec) =>
              rec.orbit.name.toLowerCase() === orbit.name.toLowerCase() &&
              rec.planet.name.toLowerCase() === planet.name.toLowerCase() &&
              rec.system.name.toLowerCase() === system.name.toLowerCase()
          );
          
          setInventory(matchedInventory.flatMap((rec) => rec.cargo));
        } else {
          console.error('Failed to add cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding cargo item:', error);
      }
  
      // Reset form fields after adding
      setAddCargoItem(false);
      setCommodity('');
      setScuValue(0);
  
    } else if (type === 'update') {
      try {
        const response = await fetch(`${devProd}update-cargo/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            commodity: comm,
            scu: scu,
          }),
        });
  
        if (response.ok) {
          const updatedRecords = await response.json(); // Get updated cargo records from the backend
          setStoredCargo(updatedRecords); // Update the state with new cargo records
  
          // Update the inventory for the current location
          const matchedInventory = updatedRecords.filter(
            (rec) =>
              rec.orbit.name.toLowerCase() === orbit.name.toLowerCase() &&
              rec.planet.name.toLowerCase() === planet.name.toLowerCase() &&
              rec.system.name.toLowerCase() === system.name.toLowerCase()
          );
  
          setInventory(matchedInventory.flatMap((rec) => rec.cargo));
        } else {
          console.error('Failed to update cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating cargo item:', error);
      }
    } else if (type === 'delete') {
      try {
        const response = await fetch(`${devProd}delete-cargo/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const updatedRecords = await response.json(); // Get updated cargo records from the backend
          setStoredCargo(updatedRecords); // Update the state with new cargo records
  
          // Filter and set the inventory for the current location
          const matchedInventory = updatedRecords.filter(
            (rec) =>
              rec.orbit.name.toLowerCase() === orbit.name.toLowerCase() &&
              rec.planet.name.toLowerCase() === planet.name.toLowerCase() &&
              rec.system.name.toLowerCase() === system.name.toLowerCase()
          );
  
          setInventory(matchedInventory.flatMap((rec) => rec.cargo));
        } else {
          console.error('Failed to delete cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting cargo item:', error);
      }
    }
    setKeyId((prev) => prev + 2);
  };
  
  
  
  return (
    <div className='cargo-record'>
      <h3>{system.name}</h3>
      <h4>{planet.name}</h4>
      <h5>{orbit.name}</h5>

      <span>
        <p>Add Cargo</p>
        <i onClick={(e) => { e.preventDefault(); setAddCargoItem(true); }} className="fi fi-sr-add"></i>
      </span>

      {addCargoItem && (
        <>
          <span>
            <select value={commodity || 'defaultOption'} onChange={selectComm}>
              <option value='defaultOption' disabled>Select a commodity</option>
              {commsList}
            </select>
            <label>
              SCU:
              <input
                type="number"
                value={scuValue}
                onChange={handleChange}
                min="0"
                max="1000"
                step="1"
              />
            </label>
            <i onClick={(e) => { e.preventDefault(); addCommodity('add'); }} className="fi fi-sr-add"></i>
          </span>
        </>
      )}
     <div style={{ width: '100%', overflowY: 'scroll' }}>
        {inventory.map((inv) => (
          <Commodities 
            key={commKey} 
            commodity={inv.commodity} 
            scu={inv.scu} 
            inv={inv} 
            commsList={commsList} 
            addCommodity={addCommodity}
            setKeyId={setKeyId}
          />
        ))}
      </div>
    </div>
  );
};

export default CargoRecord;
