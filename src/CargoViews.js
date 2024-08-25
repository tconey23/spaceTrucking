import React, {useState, useEffect} from 'react'
import MyCargo from './MyCargo'
import Select from 'react-select';
import { getData } from './apiCalls';
import { customStyles, customStylesSmall } from './dropDownStyles';
import CommodityAccordion from './CommodityAccordion';
import MyCommodities from './MyCommodities';

const CargoViews = ({systems}) => {
    const [viewType, setViewType] = useState()
    const [selectedView, setSelectedView] = useState()

    const pageOptions = [
        {value: 'locations', label: 'Locations'},
        {value: 'commodities', label: 'Commodities'},
        {value: 'planner', label: 'Load Planner'}
    ]

    const handleSelectView = (e) => {
        setSelectedView(e.value)
    }

useEffect(() => {
    setViewType(selectedView)
}, [selectedView])

  return (
    <div className='cargo-views'>
        <span className='view-select'>
            <Select 
                styles={customStylesSmall}
                options={pageOptions}
                value={selectedView}
                onChange={(e) => handleSelectView(e)}
            />
        </span>
        {viewType === 'locations' && <MyCargo systems={systems}/>} 
        {viewType === 'commodities' && <MyCommodities />} 
    </div>
  )
}

export default CargoViews
