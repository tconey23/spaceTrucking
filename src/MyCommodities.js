import React, { useState, useEffect } from 'react';
import CommodityAccordion from './CommodityAccordion';

const MyCommodities = () => {
  const [currentInventory, setCurrentInventory] = useState([]);
  const [sortedInventory, setSortedInventory] = useState([]);

  useEffect(() => {
    // Fetch cargo records from the backend
    const fetchCargoRecords = async () => {
      try {
        const response = await fetch('http://localhost:3001/cargo'); // Update the URL to match your backend endpoint
        if (response.ok) {
          const records = await response.json();

          let array = [];
          
          // Process the records to match the structure you need
          if (Array.isArray(records)) {
            records.forEach((inv) => {
              let location = [inv.system, inv.planet, inv.orbit, inv.station];
              let cargoItem = inv.cargo;
              if (cargoItem) {
                array.push({
                  id: cargoItem.id,
                  commodity: cargoItem.commodity,
                  scu: cargoItem.scu,
                  location: location,
                });
              }
            });
            setCurrentInventory(array);
          } else {
            console.error('Expected an array but got:', typeof records);
          }
        } else {
          console.error('Failed to fetch cargo records:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cargo records:', error);
      }
    };

    fetchCargoRecords();
  }, []);

  useEffect(() => {
    if (currentInventory.length > 0) {
      const uniqueCommodities = currentInventory.map(inv => inv.commodity)
        .filter((value, index, self) => self.indexOf(value) === index);

      setSortedInventory(uniqueCommodities);
    }
  }, [currentInventory]);

  useEffect(() => {
    if (currentInventory.length > 0 && sortedInventory.length > 0) {
      let finalList = {};

      currentInventory.forEach(inv => {
        const { commodity } = inv;
        const location = {
          system: inv.location[0].name,
          planet: inv.location[1].name,
          orbit: inv.location[2].name,
          station: inv.location[3].name,
          scu: inv.scu,
        };

        if (finalList[commodity]) {
          finalList[commodity].push(location);
        } else {
          finalList[commodity] = [location];
        }
      });

      setSortedInventory(finalList);
    }
  }, [currentInventory, sortedInventory]);

  return (
    <div>
      {sortedInventory && <CommodityAccordion inventory={sortedInventory} />}
    </div>
  );
};

export default MyCommodities;
