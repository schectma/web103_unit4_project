import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarSummary from '../components/CarSummary'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import { formatPrice } from '../utilities/calcprice'
import '../App.css'
import '../css/Cars.css'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState(null)
    const [options, setOptions] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        Promise.all([CarsAPI.getAllCars(), OptionsAPI.getAllOptions()])
            .then(([carsData, optionsData]) => {
                setCars(carsData)
                setOptions(optionsData)
            })
            .catch(err => setError(err.message))
    }, [])

    const handleDelete = async (car) => {
        if (!window.confirm(`Delete ${car.name}?`)) return

        try {
            await CarsAPI.deleteCar(car.id)
            setCars(prev => prev.filter(c => c.id !== car.id))
        }
        catch (err) {
            setError(err.message)
        }
    }

    if (error) return <p className='page-message'>⚠️ {error}</p>
    if (!cars) return <p className='page-message'>Loading cars…</p>

    if (cars.length === 0) {
        return (
            <p className='page-message'>
                No custom cars yet. <Link to='/'>Build your first one!</Link>
            </p>
        )
    }

    return (
        <div className='car-list'>
            {cars.map(car => (
                <article key={car.id} className='car-card'>
                    <header>
                        <h3>🏎️ {car.name}</h3>
                    </header>

                    <CarPreview car={car} options={options} />
                    <CarSummary car={car} options={options} />
                    <p className='card-price'>💰 {formatPrice(car.price)}</p>

                    <footer>
                        <Link to={`/customcars/${car.id}`} role='button'>Details</Link>
                        <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                        <button type='button' className='delete-button' onClick={() => handleDelete(car)}>Delete</button>
                    </footer>
                </article>
            ))}
        </div>
    )
}

export default ViewCars
