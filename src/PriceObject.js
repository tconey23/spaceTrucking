import React from 'react'

const PriceObject = ({commodityObject}) => {
    const data = commodityObject

  return (
    <div className='price-card'>
        <p>{data.terminal_name}</p>
        <p>{data.commodity_name}</p>
        <sub>
            <li>Buy: {data.price_buy} aUEC</li>
            <li>Sell: {data.price_sell} aUEC</li>
        </sub>
    </div>
  )
}

export default PriceObject
