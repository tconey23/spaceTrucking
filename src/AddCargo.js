import React, { useState, useEffect } from 'react';
import { getData } from './apiCalls';

const AddCargo = ({ location, setAddCargo, onCargoSubmit }) => {

  const commodityUrl = `https://uexcorp.space/api/2.0/commodities`;
  const [rawComm, setRawComm] = useState([]);
  const [commList, setCommList] = useState([]);
  const [selectedComm, setSelectedComm] = useState('');
  const [scu, setScu] = useState('');
  const [isCanSubmit, setIsCanSubmit] = useState(false);

  useEffect(() => {
    getData(commodityUrl).then(
      data => setRawComm(data.data)
    );
  }, []);

  useEffect(() => {
    if (rawComm.length > 0) {
      const options = rawComm.map((comm) => (
        <option key={comm.id} value={comm.name}>{comm.name}</option>
      ));
      setCommList(options);
    }
  }, [rawComm]);

  const selectComm = (e) => {
    setSelectedComm(e.target.value);
  };

  const selectSCU = (e) => {
    setScu(e.target.value);
  };

  const submit = () => {
    if (selectedComm && scu) {

      const storedRecords = localStorage.getItem('cargo_records');
      let cargoRecords = JSON.parse(storedRecords) || [];


      cargoRecords.forEach((system) => {
        system.system.orbits.forEach((orbit) => {
          if (orbit.orbit_name === location) {

            orbit.stored_cargo.push({
              data_stored: new Date().toISOString(),
              commodity: selectedComm,
              stored_amount: `${scu} SCU`
            });
          }
        });
      });


      localStorage.setItem('cargo_records', JSON.stringify(cargoRecords));
      onCargoSubmit(); 
      setAddCargo(false);
    }
  };

  const cancel = () => {
    setAddCargo(false);
  };

  useEffect(() => {
    setIsCanSubmit(!!selectedComm && !!scu);
  }, [selectedComm, scu]);

  return (
    <div className='cargo-form'>
      <h5>Add Cargo to {location}</h5>
      <form>
        <label>Select Commodity</label>
        <br />
        <select onChange={selectComm} value={selectedComm}>
          <option value="" disabled>Select a commodity</option>
          {commList}
        </select>
        <br />
        <label>Enter SCU</label>
        <br />
        <input type='number' onChange={selectSCU} value={scu}></input>
        <br />
        {isCanSubmit && 
          <>
            <i className="fi fi-sr-check-circle" onClick={submit}></i>
            <i className="fi fi-sr-cross-circle" onClick={cancel}></i>
          </>
        }
      </form>
    </div>
  );
};

export default AddCargo;
