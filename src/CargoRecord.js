import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';

const CargoRecord = ({ planet, system, orbit, station, token }) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [inventory, setInventory] = useState([]);

  const prod = 'https://space-trucking-backend-2d499135d3db.herokuapp.com/'
  const dev = 'http://localhost:3001/'
  useEffect(() => {
    const fetchCargoRecords = async () => {
      try {
        const response = await fetch(`${prod}cargo`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const records = await response.json();
          console.log('Full response data:', records);
  
          if (Array.isArray(records)) {
            setStoredCargo(records);

            // Filter inventory based on the current system, planet, and orbit
            const matchedInventory = records.filter(
              (rec) =>
                rec.orbit.name === orbit.name &&
                rec.planet.name === planet.name &&
                rec.system.name === system.name
            );

            // Set the filtered inventory (note: `cargo` is now a single object, not an array)
            setInventory(matchedInventory.map((rec) => rec.cargo));
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

    console.log(token)
  
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
  
    let newCargoList;
  
    if (type === 'add') {
      // Create a new cargo item with a unique ID
      const newCargoItem = { id: Date.now(), commodity, scu: scuValue };
  
      // Check if the system, planet, and orbit already exist
      const existingRecord = storedCargo.find(
        (rec) =>
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
      );
  
      if (existingRecord) {
        // If the record exists, update the existing cargo with the new item
        existingRecord.cargo = newCargoItem;
        newCargoList = storedCargo.map((rec) =>
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
            ? existingRecord
            : rec
        );
      } else {
        // If the record doesn't exist, create a new record
        const newRecord = {
          system,
          planet,
          orbit,
          station,
          cargo: newCargoItem,
        };
        newCargoList = [...storedCargo, newRecord];
      }
  
      setStoredCargo(newCargoList);
      setInventory(newCargoList.map((rec) => rec.cargo));
  
      // Send POST request to backend to add the new cargo item
      try {
        const response = await fetch(`${prod}/add-cargo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            system,
            planet,
            orbit,
            station,
            cargo: newCargoItem,
          }),
        });
  
        if (!response.ok) {
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
      // Update the existing cargo item
      newCargoList = storedCargo.map(record => {
        if (record.cargo.id === id) {
          return {
            ...record,
            cargo: { ...record.cargo, commodity: comm, scu: scu }
          };
        }
        return record;
      });
  
      setStoredCargo(newCargoList);
      setInventory(newCargoList.map((rec) => rec.cargo));
  
      // Send PUT request to backend to update the cargo item
      try {
        const response = await fetch(`${prod}update-cargo/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            commodity: comm, scu: scu,
          }),
        });
  
        if (!response.ok) {
          console.error('Failed to update cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating cargo item:', error);
      }
  
    } else if (type === 'delete') {
      // Remove the cargo item with the matching ID
      newCargoList = storedCargo.filter(rec => rec.cargo.id !== id);
  
      setStoredCargo(newCargoList);
      setInventory(newCargoList.map((rec) => rec.cargo));
  
      // Send DELETE request to backend to delete the cargo item
      try {
        const response = await fetch(`${prod}delete-cargo/${id}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          console.error('Failed to delete cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting cargo item:', error);
      }
    }
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
      {inventory.map((inv) => (
        <Commodities 
          key={inv.id} 
          commodity={inv.commodity} 
          scu={inv.scu} 
          inv={inv} 
          commsList={commsList} 
          addCommodity={addCommodity} 
        />
      ))}
    </div>
  );
};

export default CargoRecord;
