import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CarForm from '../components/CarForm'
import CarsAPI from '../services/CarsAPI'
import OptionsAPI from '../services/OptionsAPI'
import { FEATURES } from '../utilities/calcprice'
import '../App.css'

// start with the first coupe-compatible option of every feature
const getDefaultCar = (options) => {
    const car = { name: '', convertible: false }

    for (const feature of FEATURES) {
        const option = options.find(o => o.feature === feature && o.convertible !== true)
        car[`${feature}_id`] = option?.id ?? null
    }

    return car
}

const CreateCar = ({ title }) => {
    const navigate = useNavigate()
    const [options, setOptions] = useState(null)
    const [loadError, setLoadError] = useState(null)

    useEffect(() => {
        document.title = title
    }, [title])

    useEffect(() => {
        OptionsAPI.getAllOptions()
            .then(setOptions)
            .catch(error => setLoadError(error.message))
    }, [])

    const handleCreate = async (car) => {
        await CarsAPI.createCar(car)
        navigate('/customcars')
    }

    if (loadError) return <p className='page-message'>⚠️ Couldn't load options: {loadError}</p>
    if (!options) return <p className='page-message'>Loading options…</p>

    return (
        <CarForm
            options={options}
            initialCar={getDefaultCar(options)}
            submitLabel='Create'
            onSubmit={handleCreate}
        />
    )
}

export default CreateCar
