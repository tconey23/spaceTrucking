import React, { useState, useEffect } from 'react';
import { getData } from './apiCalls';
import Terminals from './Terminals';

const Systems = ({ system }) => {

    const [selectedOption, setSelectedOption] = useState('defaultOption');
    const [selectedType, setSelectedType] = useState([]);
    const [optionsList, setOptionsList] = useState([]);
    const [typeSelection, setTypeSelection] = useState('defaultOption');
    const [isSubmit, setIsSubmit] = useState(false)

    const importData = (url) => {
        getData(url)
            .then(response => {
                if (response && response.data) {
                    setSelectedType(response.data);
                } else {
                    setSelectedType([]);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setSelectedType([]);
            });
    };

    useEffect(() => {
        if (selectedType.length > 0) {
            const listOptions = selectedType.map((type) => (
                <option key={type.id} value={type.name} data-id={type.id}>{type.name}</option>
            ));
            setOptionsList(listOptions);
        } else {
            setOptionsList([]);
        }
    }, [selectedType]);

    useEffect(() => {
        if (typeSelection !== 'defaultOption') {
            console.log(typeSelection)
        }
    }, [typeSelection]);

    useEffect(() => {
        if (selectedOption !== 'defaultOption') {
            const url = `https://uexcorp.space/api/2.0/${selectedOption}?id_star_system=${system.id}`;
            importData(url);
        }
    }, [selectedOption, system.id]);

    const changeType = (e) => {
        const selectedOptionValue = e.target.value;
        const selectedOptionId = e.target.selectedOptions[0].getAttribute('data-id');
        setTypeSelection({ type: selectedOption, name: selectedOptionValue, id: selectedOptionId });
    };

    useEffect(() => {
        setSelectedOption('orbits')
    }, [])

    return (
        <div className='system-wrapper'>
            
            <h2 className='system-name'>{system.name}</h2>

            {optionsList.length > 0 && !isSubmit &&
            
            <>
            <label style={{fontSize: '10px', marginLeft: '8px'}}>{`Where in ${system.name}?  `}</label>

            <br/>
                <select value={typeSelection.name || 'defaultOption'} onChange={changeType}>
                    <option value='defaultOption' disabled>Select an option</option>
                    {optionsList}
                </select>
            </>
            }

            {typeSelection !== 'defaultOption' &&
                <>
                    <Terminals selection={typeSelection} system={system} setIsSubmit={setIsSubmit}/>
                </>
            }


        </div>
    );
};

export default Systems;
