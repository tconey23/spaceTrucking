import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';

const CargoRecord = ({ parentData}) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [inventory, setInventory] = useState([]);
  

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('cargo_records')) || [];
    setStoredCargo(records);

    const matchedInventory = records.find(
      (rec) =>
        rec.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
        rec.parentData.planet.label === parentData.planet.label &&
        rec.parentData.system.name === parentData.system.name
    );

    if (matchedInventory) {
      setInventory(matchedInventory.cargo);
    }
  }, [parentData]);

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
  
      newCargoList = storedCargo.map(record => {
        if (
          record.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
          record.parentData.planet.label === parentData.planet.label &&
          record.parentData.system.name === parentData.system.name
        ) {
          return {
            ...record,
            cargo: [...(record.cargo || []), newCargoItem] // Add new cargo item with ID
          };
        }
        return record;
      });
  
      const recordExists = newCargoList.some(
        record =>
          record.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
          record.parentData.planet.label === parentData.planet.label &&
          record.parentData.system.name === parentData.system.name
      );
  
      if (!recordExists) {
        newCargoList = [
          ...newCargoList,
          { id: Date.now(), parentData, cargo: [newCargoItem] },
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
      newCargoList = storedCargo.map(record => {
        if (
          record.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
          record.parentData.planet.label === parentData.planet.label &&
          record.parentData.system.name === parentData.system.name
        ) {
          const updatedCargo = record.cargo.filter(item => item.id !== parseInt(id))
          return { ...record, cargo: updatedCargo };
        }
        return record;
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
      <h3>{parentData.system.name}</h3>
      <h4>{parentData.planet.label}</h4>
      <h5>{parentData.moonOrOrbit.label}</h5>

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
        <Commodities key={inv.id} commodity={inv.commodity} scu={inv.scu} recordData={parentData} inv={inv} commsList={commsList} scuValue={inv.scu} setScuValue={setScuValue} setCommodity={setCommodity} addCommodity={addCommodity}/>
      ))}
    </div>
  );
};

export default CargoRecord;
