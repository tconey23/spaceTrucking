import React, { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Commodities = ({ commodity: initialCommodity, scu: initialScu, inv, commsList, addCommodity }) => {
  const [editRecord, setEditRecord] = useState(null);
  const [commodity, setCommodity] = useState(initialCommodity); // Local state for commodity
  const [scuValue, setScuValue] = useState(initialScu); // Local state for SCU

  useEffect(() => {
    if (editRecord) {
      // Initialize the local state with current values when entering edit mode
      setCommodity(initialCommodity);
      setScuValue(initialScu);
    }
  }, [editRecord, initialCommodity, initialScu]);

  const handleChange = (e) => {
    setScuValue(e.target.value);
  };

  const selectComm = (e) => {
    setCommodity(e.target.value);
  };

  const updateInventory = () => {
    // Update the inventory with the new commodity and SCU values
    addCommodity('update', inv.id, scuValue, commodity);
    setEditRecord(null); // Exit edit mode after updating
  };

  const deleteInventory = () => {
    // Delete the inventory item based on its ID
    addCommodity('delete', inv.id);
  };

  const editInventory = () => {
    setEditRecord(inv.id); // Enter edit mode for the selected inventory item
  };

  return (
    <table className='commodity-table'>
      <tbody>
        <tr>
          <th className='comm-row'>Commodity</th>
          <th className='scu-row'>SCU</th>
          <th className='comm-edit'>EDIT</th>
          <th className='comm-edit'>DELETE</th>
        </tr>
        <tr>
          {!editRecord ? (
            <>
              <td className='comm-row'>{initialCommodity}</td>
              <td className='scu-row'>{initialScu}</td>
            </>
          ) : (
            <>
              <td className='comm-row'>            
                <select value={commodity} onChange={selectComm}>
                  <option value='defaultOption' disabled>Select a commodity</option>
                  {commsList}
                </select>
              </td>
              <td className='scu-row'>
                <input
                  type="number"
                  value={scuValue}
                  onChange={handleChange}
                  min="0"
                  max="1000"
                  step="1"
                />
              </td>
            </>
          )}
          <td className='comm-edit'>
            {editRecord ? (
              <i id={inv.id} onClick={updateInventory} className="fi fi-sr-add"></i>
            ) : (
              <i id={inv.id} onClick={editInventory} className="fi fi-sr-pen-square"></i>
            )}
          </td>
          <td className='comm-edit'>
            <i id={inv.id} onClick={deleteInventory} className="fi fi-sr-trash"></i>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Commodities;
