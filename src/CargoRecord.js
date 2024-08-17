import React from 'react'
import Commodities from './Commodities'
import { useState } from 'react'

const CargoRecord = ({stationData, commData}) => {
const [isNewLine, setIsNewLine] = useState(false)
const [selectedComm, setSelectedComm] = useState('')
const [commodityList, setCommodityList] = useState()
const [rangeValue, setRangeValue] = useState(50)

const handleRangeChange = (event) => {
    setRangeValue(event.target.value);
  };

    const addCommodity = (e) => {
        setIsNewLine(true)
        const commList = []
        const elementArray = []

        commData.forEach((comm) => {
            commList.push(comm.commodity_name)
        })

        const cleanedList = new Set(commList.sort())

        cleanedList.forEach((comm) => {
            elementArray.push(<option>{comm}</option>)
        })

        setCommodityList(elementArray)
    }

    const selectComm = (e) => {
        setSelectedComm(e.target.value)
    }

  return (
    <div className='cargo-record'>
        <sup>08/14/24</sup>
        <p>{stationData.Station}</p>
        <form className='commodity-form'>
            {!isNewLine && <p onClick={(e) => addCommodity(e)}>+</p>}
            
            {isNewLine && commodityList &&
          <select value={selectedComm} onChange={selectComm}>
            <option value='' disabled>
                Select a commodity
            </option>
            {commodityList}
          </select>
            }

        {selectedComm && 
        <>
          <label htmlFor="rangeInput">Choose a value:</label>
            <input
            type="range"
            id="rangeInput"
            min="0"
            max="100"
            value={rangeValue}
            onChange={handleRangeChange}
            />
            <p>Selected Value: {rangeValue}</p>
          </>
        }
        </form>
    </div>
  )
}

export default CargoRecord
