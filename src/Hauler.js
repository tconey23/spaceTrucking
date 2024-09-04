import React, { useState, useRef, useEffect } from 'react';
import { getData } from './apiCalls';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PriceObject from './PriceObject';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Hauler = () => {
  const [imageUrl, setImageUrl] = useState();
  const[urlArray, setUrlArray] = useState([])
  const [intervalState, setIntervalState] = useState(null)
  const [allCommPrices, setAllCommPrices] = useState(0)
  const [priceObjects, setPriceObjects] = useState()
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * (90 - 1 + 1)) + 1)
  const [imageCount, setImageCount] = useState(3)
  const [currentSlide, setCurrentSlide] = useState()
  const carouselRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000000,
    slidesToShow: 4,
    slidesToScroll: allCommPrices.length /3,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    rtl: false
};

  const commodities = 'https://uexcorp.space/api/2.0/commodities_prices_all'

  const fleetYardsImages = `https://api.fleetyards.net/v1/images/random?limit=15`
  const wikiImages = `https://api.star-citizen.wiki/api/v2/galactapedia?page=${randomNumber}`

  const getImage = () => {
     getData(fleetYardsImages).then(data => {
      const newArray = data.map(url => ({
        url: url.bigUrl,
        desc: url.gallery.name
      }));
      setUrlArray(prevArray => [...prevArray, ...newArray]); // Append newArray to the existing array
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

    allCommPrices.forEach((comm, index) => {
      array.push(<PriceObject key={index} commodityObject={comm}></PriceObject>)
    })

    setPriceObjects(array)

  }

  useEffect(() => {
    const rand = Math.floor(Math.random() * (90 - 1 + 1)) + 1
    setRandomNumber(rand)
    getCommodities()
    getImage()
  }, []);

  useEffect(() => {
    const rand = Math.floor(Math.random() * (90 - 1 + 1)) + 1
    let array = []
    setRandomNumber(rand)
  
    urlArray.forEach((item, index) =>{
      array.push(
    <div key={index} className='image-container'>
      <p className='image-title'>{item.desc}</p>
      <img className="random-image" src={item.url}/>
    </div>   
    )
    })

    setImageUrl(array)
  }, [urlArray])

  useEffect(() => {
    let exit
    allCommPrices ? commObjects() : exit = null
  }, [allCommPrices])

  useEffect(() =>{
    let exit 
    currentSlide % 14 == 0 ? getImage() : exit = null
  }, [currentSlide])

  useEffect(() => {
    if (carouselRef.current) {
      setTimeout(() => {
        carouselRef.current && carouselRef.current.moveTo(1);
      }, 500);
    }
  }, [carouselRef])

  return (
    <div className='main-page'>
      <div className='slider-container'>
        <Slider {...settings}>
          {priceObjects}
        </Slider>
      </div>
      <div className='image-wrapper'>
        <Carousel ref={carouselRef} onChange={(index) => setCurrentSlide(index)} stopOnHover={false} centerMode={true} autoPlay={true} interval={3000} transitionTime={1000} infiniteLoop={true} showThumbs={false} showArrows={true} centerSlidePercentage={60} showStatus={false}>
          {imageUrl}
        </Carousel>
      </div>
      
    </div>
  );
};

export default Hauler;
