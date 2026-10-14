import React from 'react'
import { getOption } from '../utilities/calcprice'
import '../css/CarPreview.css'

// side-view illustration that recolors itself from the selected options
const CarPreview = ({ car, options }) => {
    const exterior = getOption(options, car.exterior_id)
    const roof = getOption(options, car.roof_id)
    const wheels = getOption(options, car.wheels_id)
    const interior = getOption(options, car.interior_id)

    const bodyColor = exterior?.color || '#777777'
    const roofColor = roof?.color || bodyColor
    const rimColor = wheels?.color || '#c7ccd1'
    const seatColor = interior?.color || '#1b1b1b'
    const glassRoof = roof?.name.includes('Glass')

    return (
        <svg className='car-preview' viewBox='0 0 600 220' role='img' aria-label='Preview of your custom car'>
            <ellipse cx='305' cy='200' rx='270' ry='12' fill='rgba(0, 0, 0, 0.45)' />

            {car.convertible ? (
                <g>
                    {/* open cockpit: seats show above the beltline, folded top behind them */}
                    <rect x='290' y='72' width='26' height='40' rx='8' fill={seatColor} />
                    <rect x='340' y='72' width='26' height='40' rx='8' fill={seatColor} />
                    <rect x='205' y='92' width='64' height='18' rx='8' fill={roofColor} stroke='rgba(0, 0, 0, 0.4)' />
                    <path d='M425 108 L392 70' stroke='#9ab' strokeWidth='5' strokeLinecap='round' />
                </g>
            ) : (
                <g>
                    <path d='M200 108 Q245 50 310 48 L370 50 Q410 55 445 104 Z' fill={roofColor} opacity={glassRoof ? 0.65 : 1} />
                    <path d='M222 104 Q256 64 300 61 L326 61 L326 104 Z' fill={seatColor} />
                    <path d='M338 61 L366 63 Q398 70 422 104 L338 104 Z' fill={seatColor} />
                    <path d='M222 104 Q256 64 300 61 L326 61 L326 104 Z' fill='rgba(20, 30, 45, 0.55)' />
                    <path d='M338 61 L366 63 Q398 70 422 104 L338 104 Z' fill='rgba(20, 30, 45, 0.55)' />
                </g>
            )}

            <path
                d='M40 150 Q40 122 82 116 L190 106 L460 104 Q520 110 548 120 Q572 128 572 152 L572 172 L40 172 Z'
                fill={bodyColor}
                stroke='rgba(0, 0, 0, 0.35)'
                strokeWidth='2'
            />
            <path d='M70 136 L540 132' stroke='rgba(255, 255, 255, 0.25)' strokeWidth='3' />
            <rect x='540' y='130' width='26' height='10' rx='4' fill='#ffd76a' />
            <rect x='42' y='132' width='18' height='10' rx='4' fill='#c1121f' />

            {[150, 470].map(x => (
                <g key={x}>
                    <circle cx={x} cy='170' r='36' fill='#111111' />
                    <circle cx={x} cy='170' r='23' fill={rimColor} />
                    <circle cx={x} cy='170' r='7' fill='#333333' />
                </g>
            ))}
        </svg>
    )
}

export default CarPreview
