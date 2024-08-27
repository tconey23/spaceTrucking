import React, { useState, useRef, useEffect } from 'react';
import { Autoplay } from 'swiper/modules';
import { getData } from './apiCalls';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Fleet.css';

const Fleet = () => {
  const [userName] = useState('spazmodeus');
  const [urlArray, setUrlArray] = useState([]);
  const swiperRef = useRef(null);

  const fleetYardsImages = `https://api.fleetyards.net/v1/images/random?limit=15`;

  const getImage = () => {
    getData(fleetYardsImages)
      .then((data) => {
        const newArray = data.map((url) => (
          <SwiperSlide key={url.gallery.name}>
            <div className='img-wrapper'>
              <img src={url.bigUrl} alt={url.gallery.name} />
              <div className='img-border'></div>
            </div>
          </SwiperSlide>
        ));
        setUrlArray(newArray);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  useEffect(() => {
    getImage();
  }, []);

  return (
    <div className='fleet-wrapper'>
      <div className='swiper-container'>
        <Swiper
          modules={[Autoplay]} // Include Autoplay module
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            swiper.slideTo(-1)
          }}
          slidesPerView={3}
          autoplay={{
            delay: 3000,  // Autoplay delay in ms
            disableOnInteraction: false, // Autoplay should continue after interaction
          }}
          effect={'fade'}
          speed={4000}  // Transition speed
          spaceBetween={-300}
          loop={true}  // Enable looping of slides
        >
          {urlArray}
        </Swiper>
      </div>
    </div>
  );
};

export default Fleet;
