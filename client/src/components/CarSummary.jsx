import React from 'react'
import { FEATURES, getOption, formatPrice } from '../utilities/calcprice'

// lists each chosen option (and its price) for a saved car
const CarSummary = ({ car, options }) => (
    <ul className='car-summary'>
        <li><strong>Body:</strong> {car.convertible ? 'Convertible' : 'Coupe'}</li>
        {FEATURES.map(feature => {
            const option = getOption(options, car[`${feature}_id`])

            return (
                <li key={feature}>
                    <strong>{feature}:</strong> {option?.name ?? 'Unknown'}
                    {option?.price > 0 && <span className='summary-price'> (+{formatPrice(option.price)})</span>}
                </li>
            )
        })}
    </ul>
)

export default CarSummary
