const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'lightblue' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: 10,
      '&:hover': {
        backgroundColor: 'lightgray',
      },
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'lightgray',
      borderRadius: '10px',
      border: '1px solid black',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'lightblue',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'black',
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'black',
      ':hover': {
        backgroundColor: 'red',
        color: 'white',
      },
    }),
  };

  const customStylesSmall = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'lightblue' : 'white',
      color: state.isSelected ? 'black' : 'black',
      padding: 10,
      '&:hover': {
        backgroundColor: 'lightgray',
      },
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'lightgray',
      borderRadius: '10px',
      border: '1px solid black',
      scale: '70%',
      marginBottom: '-20px',
      marginTop: '-30px',
      marginLeft: '-84px'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      fontSize: '15px',
      scale: '70%'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'lightblue',
      fontSize: '15px'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'black',
      fontSize: '15px'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: 'black',
      ':hover': {
        backgroundColor: 'red',
        color: 'white',
      },
    }),
  };

  export {
    customStyles,
    customStylesSmall
  }