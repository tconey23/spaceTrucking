import React, { useState, useEffect } from 'react';
import Commodities from './Commodities';
import commData from '../src/mockCommodityData.json';
import { postCommData } from './apiCalls';

const CargoRecord = ({ selection, system, terminal, item }) => {
  const [storedCargo, setStoredCargo] = useState([]);
  const [savedRecords, setSavedRecords] = useState(null);
  const [addCargoItem, setAddCargoItem] = useState(false);
  const [commsList, setCommsList] = useState([]);
  const [scuValue, setScuValue] = useState(0);
  const [commodity, setCommodity] = useState('');
  const [scu, setScu] = useState(null);

  useEffect(() => {
    const records = JSON.parse(localStorage.getItem('cargo_records')) || [];
    setStoredCargo(records);
  }, []);

  useEffect(() => {
    if (selection && system && terminal) {
      const newRecord = {
        id: Date.now(),
        system,
        orbit: selection,
        terminal,
        cargo: [] // Initialize an empty array to hold cargo items
      };

      const updatedCargo = [...storedCargo, newRecord];
      setStoredCargo(updatedCargo);
      localStorage.setItem('cargo_records', JSON.stringify(updatedCargo));
    }
  }, [selection, system, terminal]);

  useEffect(() => {
    if (item) {
      const element = (
        <div key={item.id}>
          <h3>{item.system.name}</h3>
          <h4>{item.orbit.name}</h4>
          <h5>{item.terminal.name}</h5>
        </div>
      );
      setSavedRecords(element);
    }
  }, [item]);

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

    // Find the most recent record (assuming that's where you want to add the cargo)
    const updatedCargo = storedCargo.map(record => {
      if(record && item) {

        if (record.id === item.id) {
          // Ensure `cargo` is initialized as an array if it's undefined or not an array
          const cargoArray = Array.isArray(record.cargo) ? record.cargo : [];
          
          return {
            ...record,
            cargo: [...cargoArray, { commodity, scu: scuValue }]
          };
        }
      }
      return record;
    });

    setStoredCargo(updatedCargo);
    localStorage.setItem('cargo_records', JSON.stringify(updatedCargo));
    setAddCargoItem(false);
    setCommodity('');
    setScuValue(0);
};

  return (
    <div className='cargo-record'>
      {savedRecords}
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
      <Commodities commodity={commodity} scu={scu} item={item} />
    </div>
  );
};

export default CargoRecord;
