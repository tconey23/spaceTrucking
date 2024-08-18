import React, { useState, useEffect } from 'react';
import { getData } from './apiCalls';
import CargoRecord from './CargoRecord';


const Terminals = ({ selection, system, setIsSubmit }) => {

  const [optionList, setOptionList] = useState([]);
  const [terminals, setTerminals] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [editMode, setEditMode] = useState(true)

  const path = `https://uexcorp.space/api/2.0/terminals?id_orbit=${selection.id}&id_star_system=${system.id}`;

  const importData = (url) => {
    getData(url)
      .then(response => {
        if (response && response.data) {
          setTerminals(response.data);
        } else {
          setTerminals([]);
          console.log('No data returned from API');
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setTerminals([]);
      });
  };

  useEffect(() => {
    importData(path);
  }, [path]);  // Make sure to include `path` as a dependency

  useEffect(() => {
    if (terminals.length > 0) {
      const options = terminals.map(term => (
        <option key={term.id} value={term.name} data-id={term.id}>
          {term.name}
        </option>
      ));
      setOptionList(options);
    } else {
      setOptionList([]);
    }
  }, [terminals]);

  const changeOption = (e) => {
    const selectedOptionValue = e.target.value;
    const selectedOptionId = e.target.selectedOptions[0].getAttribute('data-id');
    setSelectedOption({ name: selectedOptionValue, id: selectedOptionId });
  };

  const addLocation = () => {
    setEditMode(false)
    setIsSubmit(true)
  }

  return (
    <div>
{ editMode ?    
  <span>
      <select value={selectedOption?.name || 'defaultOption'} onChange={changeOption}>
        <option value='defaultOption' disabled>Select an option</option>
        {optionList}
      </select>
      {selectedOption && 
        <i onClick={addLocation} className="fi fi-sr-add"></i>
      }
      </span>
      :
      <CargoRecord selection={selection} system={system} terminal={selectedOption}/>
    }
    </div>
  );
};

export default Terminals;
