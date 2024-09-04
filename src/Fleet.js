import React, { useState, useRef, useEffect, lazy } from 'react';
import { Autoplay, EffectFade } from 'swiper/modules';
import { getData } from './apiCalls';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './Fleet.css';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import Ships from './Ships';
import Loading from './Loading';
import SuspenseWithMinTime from './SuspenseWithMinTime';
import { useSpring, animated, easings } from 'react-spring';
const ShipsComp = lazy (() => import('./Ships'))

const Fleet = () => {
  const [userName] = useState('spazmodeus');
  const [myHangar, setMyHangar] = useState([]);
  const [renderHangar, setRenderHangar] = useState();
  const [swiperToggle, setSwiperToggle] = useState('play');
  const [urlArray, setUrlArray] = useState([]);
  const [imagesToggle, setImagesToggle] = useState('collapse');
  const swiperRef = useRef(null);

  const fleetYardsImages = `https://api.fleetyards.net/v1/images/random?limit=15`;
  const hangarPath = `https://api.fleetyards.net/v1/public/hangars/${userName}`;
  const otherHangarPath = `https://api.fleetyards.net/v1/hangar?`

  const fadeIn = useSpring({
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
    config: {
        duration: 1500,
        easing: easings.easeInOutCubic,
      },
  })

  const getImage = async () => {
    try {
      const data = await getData(fleetYardsImages);
      const newArray = data.map((url) => (
        <SwiperSlide key={url.gallery.name}>
          <img
            src={url.bigUrl}
            style={{
              width: 600,
              height: 400,
              filter: 'blur(10px)',
            }}
            alt={url.gallery.name}
          />
        </SwiperSlide>
      ));
      setUrlArray(newArray);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getLoanerInfo = async (veh) => {
    const path = `https://api.fleetyards.net/v1/search?q%5Bsearch%5D=${veh}`;
    try {
      const data = await getData(path);
      return data.map((dat) => ({
        id: dat.id,
        scId: dat.item.scIdentifier,
        name: dat.item.name,
        manufacturer: {
          name: dat.item.manufacturer.name,
          slug: dat.item.manufacturer.slug,
          logo: dat.item.manufacturer.logo,
        },
        type: dat.item.classification,
        focus: dat.item.focus,
        capacity: `${dat.item.cargo} scu`,
        image: dat.item.fleetchartImage,
      }));
    } catch (error) {
      console.error('Error fetching loaner info:', error);
      return null;
    }
  };

  const getHangar = async () => {
    try {
      const data = await getData(hangarPath);
      const newArray = await Promise.all(
        data.map(async (ship) => {
          const loanerInfo = await Promise.all(
            ship.model.loaners.map((veh) => getLoanerInfo(veh.slug))
          );
          return {
            id: ship.id,
            scId: ship.model.scIdentifier,
            name: ship.model.name,
            manufacturer: {
              name: ship.model.manufacturer.name,
              slug: ship.model.manufacturer.slug,
              logo: ship.model.manufacturer.logo,
            },
            type: ship.model.classification,
            focus: ship.model.focus,
            capacity: `${ship.model.cargo} scu`,
            image: ship.model.media.storeImage.large,
            holo: ship.model.holo,
            loaner: loanerInfo,
          };
        })
      );
      setMyHangar(newArray);
    } catch (error) {
      console.error('Error fetching hangar data:', error);
    }
  };

  useEffect(() => {
    getImage();
    getHangar();
  }, []);



  useEffect(() => {
    // if (swiperRef.current) {
    //   if (swiperToggle === 'play') {
    //     swiperRef.current.autoplay.start();
    //   } else {
    //     swiperRef.current.autoplay.stop();
    //   }
    // }
  }, [swiperToggle]);

  const pauseSwiper = () => {
    setSwiperToggle((prevToggle) => (prevToggle === 'play' ? 'pause' : 'play'));
  };

  const handleAccClick = () => {
    setImagesToggle((prev) => (prev === 'collapse' ? 'expand' : 'collapse'));
  };

  return (
    <div className='fleet-wrapper'>
      {/* <Accordion allowZeroExpanded={true}>
        <AccordionItem onClick={handleAccClick} uuid={'images-panel'}>
          <AccordionItemHeading>
            <AccordionItemButton>{imagesToggle}</AccordionItemButton>
          </AccordionItemHeading>
          {imagesToggle === 'collapse' && (
            <>
              <div>
                <button onClick={pauseSwiper}>
                  {swiperToggle === 'play' ? 'Pause' : 'Play'}
                </button>
              </div>
              <AccordionItemPanel>
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  slidesPerView={3}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  effect={'fade'}
                  speed={4000}
                  spaceBetween={-100}
                  loop={true}
                >
                  {urlArray}
                </Swiper>
              </AccordionItemPanel>
            </>
          )}
        </AccordionItem>
      </Accordion> */}
      <div className='fleet-menu'>
        <div className='fleet-list'>
          <SuspenseWithMinTime fallback={<Loading/>} minDisplayTime={4000}>
            <ShipsComp myHangar={myHangar}></ShipsComp>
          </SuspenseWithMinTime>
        </div>
      </div>
    </div>
  );
};

export default Fleet;
