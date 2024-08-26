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
    const records = JSON.parse(localStorage.getItem('cargo_records')) || [];
    setStoredCargo(records);
    console.log(records)

    const matchedInventory = records.find(
      (rec) =>
        rec.orbit.name === orbit.name &&
        rec.planet.name === planet.name &&
        rec.system.name === system.name
    );

    if (matchedInventory) {
      setInventory(matchedInventory.cargo);
    }
    console.log(system, planet, orbit, station)
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

  const addCommodity = (type, id = null, scu, comm) => {
    if (type === 'add' && (!commodity || !scuValue)) {
      alert("Please select a commodity and enter a valid SCU value.");
      return;
    }
  
    let newCargoList;
  
    if (type === 'add') {
      // Adding a new commodity
      const newCargoItem = { id: Date.now(), commodity, scu: scuValue };
  
      newCargoList = storedCargo.map(rec => {
        if (
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
        ) {
          return {
            ...rec,
            cargo: [...(rec.cargo || []), newCargoItem] // Add new cargo item with ID
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
  
    } else if (type === 'update') {
      console.log(id, comm, scu)
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
  
    } else if (type === 'delete') {
      // Deleting an existing commodity by ID
      newCargoList = storedCargo.map(rec => {
        if (
          rec.orbit.name === orbit.name &&
          rec.planet.name === planet.name &&
          rec.system.name === system.name
        ) {
          const updatedCargo = rec.cargo.filter(item => item.id !== parseInt(id))
          return { ...rec, cargo: updatedCargo };
        }
        return rec;
      });
  
      setInventory(prevInventory => prevInventory.filter(item => item.id !== parseInt(id)))
    }
  
    // Update the stored cargo and localStorage
    setStoredCargo(newCargoList);
    localStorage.setItem('cargo_records', JSON.stringify(newCargoList));
  
    if (type === 'add' || type === 'update') {
      // Reset form fields after adding or updating
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
