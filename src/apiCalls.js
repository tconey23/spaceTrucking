

const allCommPrices = '	https://uexcorp.space/api/2.0/commodities_prices_all'


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

export {
    getData,
}