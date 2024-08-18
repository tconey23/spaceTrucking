import React from 'react'
import Commodities from './Commodities'
import { postCommData } from './apiCalls'
import { useState, useEffect } from 'react'
 
const CargoRecord = ({stationData, commData}) => {
const [isNewLine, setIsNewLine] = useState(false)
const [selectedComm, setSelectedComm] = useState('')
const [commodityList, setCommodityList] = useState()
const [rangeValue, setRangeValue] = useState(0)
const [commLines, setCommLines] = useState([])

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

    const addCommLine = (e) => {
      let commArray = []
      const commElement = (<Commodities key={Date.now()} commodity={selectedComm} scu={rangeValue}/>)
      
      setCommLines(prev => [...prev, commElement])
      postData(stationData.Station, rangeValue, selectedComm)

      setSelectedComm('')
      setRangeValue(0)
    }

    const postData = (station, scu, comm) => {
      // postCommData(station, scu, comm)
    }


  return (
    <div className='cargo-record'>
        <sup>08/14/24</sup>
          
          <p className='station-name'>{stationData.Station}</p>
        <form className='commodity-form'>
        <label htmlFor="rangeInput"> Commodity </label>
            {!isNewLine && <p className='tooltip' onClick={(e) => addCommodity(e)}>+<span className="tooltiptext">Add commodity</span></p>}
            
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
          <label htmlFor="rangeInput"> SCU </label>
            <input
            type="number"
            id="rangeInput"
            min="0"
            max="1000"
            value={rangeValue}
            onChange={handleRangeChange}
            />
          </>
        }

        {selectedComm && 
            <p className='tooltip' onClick={(e) => addCommLine(e)}>+<span className="tooltiptext">Add item</span></p>
        }
        </form>
        {commLines}
    </div>
  )
}

export default CargoRecord
