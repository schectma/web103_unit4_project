import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CarForm from '../components/CarForm'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import '../App.css'

const EditCar = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [options, setOptions] = useState(null)
    const [loadError, setLoadError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        Promise.all([CarsAPI.getCar(id), OptionsAPI.getAllOptions()])
            .then(([carData, optionsData]) => {
                setCar(carData)
                setOptions(optionsData)
            })
            .catch(error => setLoadError(error.message))
    }, [id])

    const handleUpdate = async (updatedCar) => {
        await CarsAPI.updateCar(id, updatedCar)
        navigate(`/customcars/${id}`)
    }

    const handleDelete = async () => {
        if (!window.confirm(`Delete ${car.name}?`)) return

        try {
            await CarsAPI.deleteCar(id)
            navigate('/customcars')
        }
        catch (error) {
            setLoadError(error.message)
        }
    }

    if (loadError) return <p className='page-message'>⚠️ {loadError}</p>
    if (!car || !options) return <p className='page-message'>Loading car…</p>

    return (
        <div>
            <CarForm
                key={car.id}
                options={options}
                initialCar={car}
                submitLabel='Update'
                onSubmit={handleUpdate}
            />
            <div className='page-actions'>
                <button type='button' className='delete-button' onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}

export default EditCar
