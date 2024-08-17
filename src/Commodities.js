import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { getData } from './apiCalls'
import commData from '../src/mockCommodityData.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Commodities = ({commodity, scu}) => {

  return (
    <table className='commodity-table'>
      <tr>
        <th>Commodity</th>
        <th>SCU</th>
        <th>EDIT</th>
      </tr>
      <tr>
        <td>{commodity}</td>
        <td>{scu}</td>
        <tr>
          <td className='comm-edit'>Modify</td>
          |
          <td className='comm-edit'>Delete</td>
        </tr>       
      </tr>
    </table>
  )
}

export default Commodities
