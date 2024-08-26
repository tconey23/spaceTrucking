import React, {useState, useEffect} from 'react'
import CommodityAccordion from './CommodityAccordion'

const MyCommodities = () => {

    const [currentInventory, setCurrentInventory] = useState()
    const [sortedInventory, setSortedInventory] =useState([])

    useEffect(() =>{
        const inventory = JSON.parse(localStorage.getItem('cargo_records') || [])

        let array = []

        if(inventory){
            inventory.forEach((inv) =>{
                if(inv.cargo.length){
                    let location = [inv.system, inv.planet, inv.orbit, inv.station]
                    inv.cargo.forEach((cargo) => {
                        array.push({id:cargo.id, commodity: cargo.commodity, scu: cargo.scu, location: location})
                    })
                }
            })
            setCurrentInventory(array)
        }
    }, [])

    useEffect(() => {
        if (currentInventory) {
            const array = currentInventory.map(inv => ({ commodity: inv.commodity }));
    
            const uniqueCommodities = array.filter((item, index, self) =>
                index === self.findIndex((t) => (
                    t.commodity === item.commodity
                ))
            );
    
            setSortedInventory(uniqueCommodities);
        }
    }, [currentInventory]);
    
    useEffect(() => {
        if (currentInventory && sortedInventory.length > 0) {
            let finalList = {};
    
            currentInventory.forEach(inv => {
                const { commodity } = inv;
                const location = {
                    system: inv.location[0].name,
                    planet: inv.location[1].name,
                    station: inv.location[2].name,
                    orbit: inv.location[3].name,
                    scu: inv.scu
                };

                console.log(location)
    
                if (finalList[commodity]) {
                    finalList[commodity].push(location);
                } else {
                    finalList[commodity] = [location];
                }
            });
            console.log(finalList)
            setSortedInventory(finalList);
        }
    }, [currentInventory, sortedInventory]);

  return (
    <div>
      {sortedInventory && <CommodityAccordion inventory={sortedInventory}/>}
    </div>
  )
}

export default MyCommodities
