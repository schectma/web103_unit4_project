import React, { useState } from 'react'
import CarPreview from './CarPreview'
import { FEATURES, calcTotalPrice, formatPrice } from '../utilities/calcprice'
import { getCarErrors } from '../utilities/validation'
import '../css/CarForm.css'

const CarForm = ({ options, initialCar, submitLabel, onSubmit }) => {
    const [car, setCar] = useState(initialCar)
    const [errors, setErrors] = useState([])
    const [submitting, setSubmitting] = useState(false)

    const updateCar = (changes) => {
        setCar(prev => ({ ...prev, ...changes }))
        setErrors([])
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const carErrors = getCarErrors(car, options)
        if (carErrors.length > 0) {
            setErrors(carErrors)
            return
        }

        try {
            setSubmitting(true)
            await onSubmit({ ...car, name: car.name.trim() })
        }
        catch (error) {
            setErrors([error.message])
        }
        finally {
            setSubmitting(false)
        }
    }

    return (
        <form className='car-form' onSubmit={handleSubmit}>
            <div className='car-form-top'>
                <input
                    type='text'
                    placeholder='My New Car'
                    value={car.name}
                    onChange={(e) => updateCar({ name: e.target.value })}
                    aria-label='Car name'
                />

                <label className='convertible-toggle'>
                    <input
                        type='checkbox'
                        checked={car.convertible}
                        onChange={(e) => updateCar({ convertible: e.target.checked })}
                    />
                    Convertible
                </label>

                <input type='submit' value={submitting ? 'Saving…' : submitLabel} disabled={submitting} />
            </div>

            {errors.length > 0 && (
                <div className='car-form-errors' role='alert'>
                    {errors.map(error => <p key={error}>⚠️ {error}</p>)}
                </div>
            )}

            <div className='car-form-body'>
                <div className='car-form-preview'>
                    <CarPreview car={car} options={options} />
                    <div className='car-price'>💰 {formatPrice(calcTotalPrice(car, options))}</div>
                </div>

                <div className='car-form-features'>
                    {FEATURES.map(feature => (
                        <fieldset key={feature}>
                            <legend>{feature}</legend>
                            <div className='option-grid'>
                                {options.filter(option => option.feature === feature).map(option => (
                                    <button
                                        type='button'
                                        key={option.id}
                                        className={`option-button${car[`${feature}_id`] === option.id ? ' selected' : ''}`}
                                        onClick={() => updateCar({ [`${feature}_id`]: option.id })}
                                    >
                                        <span
                                            className='option-swatch'
                                            style={{ background: option.color || 'linear-gradient(135deg, #999, #444)' }}
                                        />
                                        <span className='option-name'>{option.name}</span>
                                        <span className='option-price'>
                                            {option.price > 0 ? `+${formatPrice(option.price)}` : 'Included'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    ))}
                </div>
            </div>
        </form>
    )
}

export default CarForm
