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
      width: '50px'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      fontSize: '10px',
      width: '50px'
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'lightblue',
      fontSize: '20px',
      width: '50px'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: 'black',
      fontSize: '20px'
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
      marginTop: '-20px',
      marginLeft: '-84px',
      overflowY: 'scroll',
      maxHeight: '30px',
      maxWidth: '800px'
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '10px',
      fontSize: '15px',
      scale: '70%',
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: 'lightblue',
      fontSize: '15px',
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