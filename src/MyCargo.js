import React from 'react'
import { getData } from './apiCalls'
import Commodities from './Commodities'
import terminals from '../src/mockTerminals.json'
import { useState, useEffect, useMemo } from 'react'
import Terminals from './Terminals'


const MyCargo = ({commData, systemData, systems}) => {


    const [commodityNames, setCommodityNames] = useState(null)

    const dataResp = commData.status
    const allCommodities = commData

        const commodityList = useMemo(() => {
            let commArray = []
            
            for(let i=0; i<allCommodities.length; i++){
                commArray.push(
                    allCommodities[i].commodity_name
                )
            }
            return commArray
        }, [dataResp])
 
        useEffect(() =>{
            let elementArray = []
            const sortedList = commodityList.sort()
            new Set(sortedList).forEach((item, index) =>{
                elementArray.push(<option key={index}>{item}</option>)
            })
            setCommodityNames(elementArray)
        }, [commData])

  return (
    <div>
        <form>
            <select>
                {commodityNames}
            </select>
            <Terminals systems={systems} systemData={systemData} />
        </form>
    </div>
  )
}

export default MyCargo
