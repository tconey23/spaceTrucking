import React, { useState, useEffect } from 'react';
import { getData } from './apiCalls';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PriceObject from './PriceObject';
import Scripts from './Scripts';

const Hauler = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [intervalState, setIntervalState] = useState(null)
  const [allCommPrices, setAllCommPrices] = useState(0)
  const [priceObjects, setPriceObjects] = useState()

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '50px'
};
  
  const randomImage = 'https://api.star-citizen.wiki/api/v2/galactapedia';
  const commodities = 'https://uexcorp.space/api/2.0/commodities_prices_all'

  const getImage = () => {
    getData(randomImage).then(data => {
      const min = 0;
      const max = data.data.length - 1;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      setImageUrl(data.data[randomNumber].thumbnail);
    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const getCommodities = () => {
    getData(commodities).then(data => {
      setAllCommPrices(data.data)

    }).catch(error => {
      console.error('Error fetching data:', error);
    });
  };

  const commObjects = () => {

    let array = []

    allCommPrices.forEach((comm) => {
      array.push(<PriceObject commodityObject={comm}></PriceObject>)
    })

    setPriceObjects(array)

  }

  useEffect(() => {
    getCommodities()
    getImage();
    const intervalID = setInterval(getImage, 5000);
    setIntervalState(intervalID);

    return () => {
      clearInterval(intervalID);
    };
  }, []);

  useEffect(() => {
    let exit
    allCommPrices ? commObjects() : exit = null
  }, [allCommPrices])

  return (
    <div className='main-page'>
      <div className='slider-container'>
        <Slider {...settings}>
          {priceObjects}
        </Slider>
      </div>
      <div className='splash-img-container'>
        {imageUrl && <img className="splash-image" src={imageUrl} alt="Random Star Citizen Image" />}
      </div>
      <Scripts/>
    </div>
  );
};

export default Hauler;
