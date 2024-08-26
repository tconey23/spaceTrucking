import React, { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';


const CommodityAccordion = ({ inventory }) => {
    const groupBySystemAndPlanet = (locations) => {
        const grouped = {};
        console.log(locations)
        if (Array.isArray(locations)) {
            locations.forEach((location) => {
                const { system, planet, station, scu } = location;
    
                if (!grouped[system]) {
                    grouped[system] = {};
                }
    
                if (!grouped[system][planet]) {
                    grouped[system][planet] = [];
                }
    
                grouped[system][planet].push({ station, scu });
            });
        } else {
            console.error("Expected locations to be an array, but got:", typeof locations, locations);
        }
    
        return grouped;
    };

    const calculateTotalSCU = (locations) => {
        
        if (!Array.isArray(locations)) {
            locations = [locations]; // Wrap in an array if it's a single object
        }
    
        return locations.reduce((total, location) => {
            const scuValue = parseFloat(location.scu) || 0;  // Parse the SCU as a number
            return total + scuValue;
        }, 0);
    };

    return (
    <div className='accordion-wrapper'>
        {!inventory && <div>No inventory to display</div>}
        <Accordion allowZeroExpanded>
            {inventory && Object.entries(inventory).map(([resource, locations], index) => {
                const groupedLocations = groupBySystemAndPlanet(locations);
                const totalSCU = calculateTotalSCU(locations);
                
                return (
                    <AccordionItem key={index}>
                        <AccordionItemHeading>
                            <AccordionItemButton>{resource} - Total: {totalSCU} scu</AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className='system-panel'>
                            {Object.entries(groupedLocations).map(([system, planets], sysIndex) => (
                                <div key={sysIndex}>
                                    <Accordion allowZeroExpanded>
                                        <AccordionItem>
                                            <AccordionItemHeading>
                                                <AccordionItemButton>System: {system}</AccordionItemButton>
                                            </AccordionItemHeading>
                                            <AccordionItemPanel className='planet-panel'>
                                                {Object.entries(planets).map(([planet, stations], planetIndex) => (
                                                    <Accordion allowZeroExpanded key={planetIndex}>
                                                        <AccordionItem>
                                                            <AccordionItemHeading>
                                                                <AccordionItemButton>Planet: {planet}</AccordionItemButton>
                                                            </AccordionItemHeading>
                                                            <AccordionItemPanel className='station-panel'>
                                                                {stations.map((station, stationIndex) => (
                                                                    <div key={stationIndex}>
                                                                        <p className='loc-panel'>{station.station}</p>
                                                                        <h6 className='scu-panel'>{station.scu} scu</h6>
                                                                    </div>
                                                                ))}
                                                            </AccordionItemPanel>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ))}
                                            </AccordionItemPanel>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            ))}
                        </AccordionItemPanel>
                    </AccordionItem>
                );
            })}
        </Accordion>
    </div>
    );
};

export default CommodityAccordion;
