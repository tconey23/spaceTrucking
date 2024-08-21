import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { getData } from './apiCalls'
import commData from '../src/mockCommodityData.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Commodities = ({commodity, scu}) => {
  const[savedCargo, setSavedCargo] = useState()

  useEffect(() =>{

    let exit

    // const listItems = () => {
    //   let array = []
    //   item.cargo.forEach((cargo, i) =>{
    //     array.push(
    //     <tr key={i}>
    //      <td className='comm-row'>{cargo.commodity}</td>
    //      <td className='scu-row'>{cargo.scu} SCU</td>
    //       <td className='comm-edit'>Modify</td>
    //       |
    //       <td className='comm-edit'>Delete</td>
    //     </tr>
    //   )
    //   })

    //   setSavedCargo(array)
    // }

    // item ? listItems() : exit = null

  }, [])

  return (

    <>
    
    <table className='commodity-table'>
      <tbody>
        <tr>
          <th className='comm-row'>Commodity</th>
          <th className='scu-row'>SCU</th>
          <th className='comm-edit'>EDIT</th>
          <th className='comm-edit'>DELETE</th>
        </tr>
        <tr>
          <td className='comm-row'>{commodity}</td>
          <td className='scu-row'>{scu}</td>
          <td className='comm-edit'>
            <i class="fi fi-sr-pen-square"></i>
          </td>
          <td className='comm-edit'>
            <i class="fi fi-sr-trash"></i>
          </td>
        </tr>
      </tbody>
    </table>
    </>
  )
}

export default Commodities
