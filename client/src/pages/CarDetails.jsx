import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CarPreview from '../components/CarPreview'
import CarSummary from '../components/CarSummary'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import { BASE_PRICE, formatPrice } from '../utilities/calcprice'
import '../App.css'
import '../css/Cars.css'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [options, setOptions] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        Promise.all([CarsAPI.getCar(id), OptionsAPI.getAllOptions()])
            .then(([carData, optionsData]) => {
                setCar(carData)
                setOptions(optionsData)
            })
            .catch(err => setError(err.message))
    }, [id])

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${car.name}?`)) return

        try {
            await CarsAPI.deleteCar(id)
            navigate('/customcars')
        }
        catch (err) {
            setError(err.message)
        }
    }

    if (error) return <p className='page-message'>⚠️ {error}</p>
    if (!car) return <p className='page-message'>Loading car…</p>

    return (
        <article className='car-details'>
            <header>
                <h2>🏎️ {car.name}</h2>
            </header>

            <CarPreview car={car} options={options} />

            <div className='car-details-info'>
                <CarSummary car={car} options={options} />
                <div>
                    <p>Base price: {formatPrice(BASE_PRICE)}</p>
                    <p className='card-price'>💰 Total: {formatPrice(car.price)}</p>
                </div>
            </div>

            <footer>
                <Link to={`/edit/${car.id}`} role='button'>Edit</Link>
                <button type='button' className='delete-button' onClick={handleDelete}>Delete</button>
            </footer>
        </article>
    )
}

export default CarDetails
