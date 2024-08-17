import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import { getData } from './apiCalls'
import commData from '../src/mockCommodityData.json'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Commodities = () => {
    const [sliderData, setSliderData] = useState() 

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

  return (
    <div className='commodity-list'>
    </div>
  )
}

export default Commodities
