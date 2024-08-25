

const locationPath = 'https://sc-trade.tools/api/locations'

const getLocData = () => {
    
    fetch('https://sc-trade.tools/api/locations', {
        method: 'GET',  
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => console.error('Fetch error:', error));  
        
    }

    getLocData('https://sc-trade.tools/api/locations')

export {
    getLocData
}