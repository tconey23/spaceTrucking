import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';

const CargoRecord = ({ planet, system, orbit, station}) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const fetchCargoRecords = async () => {
      try {
        const response = await fetch('http://localhost:3001/cargo');
        if (response.ok) {
          const data = await response.json();
          console.log('Full response data:', data);
  
          const records = data.cargo_records || [];
          if (Array.isArray(records)) {
            setStoredCargo(records);

            // Find matching inventory based on the current system, planet, and orbit
            const matchedInventory = records.find(
              (rec) =>
                rec.orbit.name === orbit.name &&
                rec.planet.name === planet.name &&
                rec.system.name === system.name
            );
  
            // If matched inventory is found, set it to inventory state
            if (matchedInventory) {
              setInventory(matchedInventory.cargo);
            } else {
              setInventory([]); // No match, set inventory to empty array
            }
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
  
    fetchCargoRecords();
  }, [system, planet, orbit, station]);
  

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
      const newCargoItem = { id: Date.now(), commodity, scu: scuValue };
  
      newCargoList = storedCargo.map(rec => {
        if (
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
        ) {
          return {
            ...rec,
            cargo: [...(rec.cargo || []), newCargoItem]
          };
        }
        return rec;
      });
  
      const recordExists = newCargoList.some(
        rec =>
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
      );
  
      if (!recordExists) {
        newCargoList = [
          ...newCargoList,
          { id: Date.now(), system, planet, orbit, station, cargo: [newCargoItem] },
        ];
      }
  
      setInventory((prevInventory) => [...prevInventory, newCargoItem]);
  
      // Send POST request to backend to add new cargo item
      try {
        const response = await fetch('http://localhost:3001/add-cargo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            system, planet, orbit, station, cargo: newCargoItem,
          }),
        });
  
        if (!response.ok) {
          console.error('Failed to add cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding cargo item:', error);
      }
  
    } else if (type === 'update') {
      newCargoList = storedCargo.map(record => {
        return {
          ...record,
          cargo: record.cargo.map(item => {
            if (item.id === parseInt(id)) {
              return { ...item, commodity: comm, scu: scu };
            }
            return item;
          })
        };
      });
  
      setInventory(prevInventory => prevInventory.map(item => item.id === parseInt(id) ? { ...item, commodity: comm, scu: scu } : item));
  
      // Send PUT request to backend to update cargo item
      try {
        const response = await fetch(`http://localhost:3001/update-cargo/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
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
      newCargoList = storedCargo.map(rec => {
        if (
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
        ) {
          const updatedCargo = rec.cargo.filter(item => item.id !== parseInt(id));
          return { ...rec, cargo: updatedCargo };
        }
        return rec;
      });
  
      setInventory(prevInventory => prevInventory.filter(item => item.id !== parseInt(id)));
  
      // Send DELETE request to backend to delete cargo item
      try {
        const response = await fetch(`http://localhost:3001/delete-cargo/${id}`, {
          method: 'DELETE',
        });
  
        if (!response.ok) {
          console.error('Failed to delete cargo item:', response.statusText);
        }
      } catch (error) {
        console.error('Error deleting cargo item:', error);
      }
    }
  
    setStoredCargo(newCargoList);
  
    if (type === 'add' || type === 'update') {
      setAddCargoItem(false);
      setCommodity('');
      setScuValue(0);
    }
  };
  

  return (
    <div className='cargo-record'>
      <h3>{system.name}</h3>
      <h4>{planet.name}</h4>
      <h5>{orbit.name}</h5>

      <span>
        <p>Add Cargo</p>
        <i onClick={() => setAddCargoItem(true)} className="fi fi-sr-add"></i>
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
            <i onClick={()=>addCommodity('add')} className="fi fi-sr-add"></i>
          </span>
        </>
      )}
      {inventory.map((inv) => (
        <Commodities key={inv.id} commodity={inv.commodity} scu={inv.scu} recordData={[system, planet, orbit, station]} inv={inv} commsList={commsList} scuValue={inv.scu} setScuValue={setScuValue} setCommodity={setCommodity} addCommodity={addCommodity}/>
      ))}
    </div>
  );
};

export default CargoRecord;
