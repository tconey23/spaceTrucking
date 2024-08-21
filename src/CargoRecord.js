import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';

const CargoRecord = ({ item, parentData }) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    // Load stored cargo records from localStorage
    const records = JSON.parse(localStorage.getItem('cargo_records')) || [];
    setStoredCargo(records);

    // Filter records to match the current parentData
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

  // Load commodities data for the select dropdown
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

  const addCommodity = () => {
    if (!commodity || !scuValue) {
      alert("Please select a commodity and enter a valid SCU value.");
      return;
    }

    // Find the correct record to update or add a new record if it doesn't exist
    const updatedCargo = storedCargo.map(record => {
      if (
        record.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
        record.parentData.planet.label === parentData.planet.label &&
        record.parentData.system.name === parentData.system.name
      ) {
        return {
          ...record,
          cargo: [...(record.cargo || []), { commodity, scu: scuValue }]
        };
      }
      return record;
    });

    // If no matching record was found, add a new one
    const recordExists = updatedCargo.some(
      record =>
        record.parentData.moonOrOrbit.label === parentData.moonOrOrbit.label &&
        record.parentData.planet.label === parentData.planet.label &&
        record.parentData.system.name === parentData.system.name
    );

    const newCargoList = recordExists
      ? updatedCargo
      : [...updatedCargo, { id: Date.now(), parentData, cargo: [{ commodity, scu: scuValue }] }];

    // Update localStorage and component state
    setStoredCargo(newCargoList);
    localStorage.setItem('cargo_records', JSON.stringify(newCargoList));
    setAddCargoItem(false);
    setCommodity('');
    setScuValue(0);
    setInventory((prevInventory) => [...prevInventory, { commodity, scu: scuValue }]);
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
            <i onClick={addCommodity} className="fi fi-sr-add"></i>
          </span>
        </>
      )}
      {inventory.map((inv, index) => (
        <Commodities key={index} commodity={inv.commodity} scu={inv.scu} />
      ))}
    </div>
  );
};

export default CargoRecord;
