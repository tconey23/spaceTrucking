

const allCommPrices = '	https://uexcorp.space/api/2.0/commodities_prices_all'
const randomImage = 'https://api.star-citizen.wiki/api/v2/comm-link-images/random'
const corsProxy = `https://cors-anywhere.herokuapp.com/`;
const fltydsSession = `https://api.fleetyards.net/v1/sessions`;

const postData = {
    "login": "spazmodeus",
    "password": "MaxMaddie1987",
    "rememberMe": true
  }

const cookie1 = "FLTYRD=54d82a9dfbbc3073b7990e4ec5329bc6"
const cookie2 = "FLTYRD_USER_STORED=eyJfcmFpbHMiOnsibWVzc2FnZSI6Ilcxc2laV0l5Tm1NeFltRXRZVGM0TlMwME5UZ3hMV0poWm1FdFpERTRZakEzWVdFeE1UUTVJbDBzSWlReVlTUXhNQ1JZU0dsbVUyeDRZMmxhV2xsbFdtMWlWMlEyTWtGbElpd2lNVGN5TkRneE1qUXpPQzQ0TmpFMk1UWTBJbDA9IiwiZXhwIjoiMjAyNS0wMi0yOFQwMzozMzo1OC44NjFaIiwicHVyIjoiY29va2llLkZMVFlSRF9VU0VSX1NUT1JFRCJ9fQ%3D%3D--2282299d376db0525d8b2c6907ad8280848cfcbc"
  
  const fltdsLogin = async () => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(fltydsSession)}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: {
            "login": "spazmodeus",
            "password": "MaxMaddie1987",
            "rememberMe": true
          },
      });
      const data = await response.json();
      const parsedData = JSON.parse(data.contents); // parse the JSON string from the response
  
      console.log(parsedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

// fltdsLogin()

const getData = (url) => {    
    const options = {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    return fetch(url, options) // Return the promise
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`); 
            }
            return response.json(); 
        })
        .then(data => {
            return data; // This data will be returned to the caller
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            return null; // Optionally return null or an empty object/array if there's an error
        });        
}

const getGalactapedia = (query) => {
    return fetch('https://api.star-citizen.wiki/api/v2/galactapedia/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "query": query,
        })
    })
    .then(response => response.json())
    .then(data => {
        const result = data.data.find(dat => dat.type === 'PlanetMoonSpaceStationPlatform');
        return result ? result['thumbnail'] : null; // Return thumbnail if found, else return null
    })
    .catch(error => {
        console.error('Error:', error);
        return null; // Return null or handle error as needed
    });
};


export {
    getData,
    getGalactapedia
}