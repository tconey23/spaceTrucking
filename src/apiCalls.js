

const allCommPrices = '	https://uexcorp.space/api/2.0/commodities_prices_all'
const randomImage = 'https://api.star-citizen.wiki/api/v2/comm-link-images/random'

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

const postCommData = (station, scu, comm) => {
    console.log(station, scu, comm)

    const postData = {
        station: station,
        scu: scu,
        comm: comm
    }

    fetch('https://space-trucking-be-466080496ee3.herokuapp.com/api/cargo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

const getCargo = () => {
    console.log('fetching')
    fetch('https://space-trucking-be-466080496ee3.herokuapp.com/api/cargo')
        .then(response => response.json())
        .then(data => console.log('Stored Data:', data))
        .catch(error => console.error('Error:', error));
}

postCommData('Station A', 'SCU123', 'This is a test cargo')


export {
    getData,
    postCommData,
}