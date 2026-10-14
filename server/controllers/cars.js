import { pool } from '../config/database.js'

const BASE_PRICE = 65000
const FEATURES = ['exterior', 'roof', 'wheels', 'interior']

// looks up the selected options and makes sure the combination is possible,
// returning either an error message or the computed total price
const checkCar = async (car) => {
    if (!car.name || !car.name.trim()) {
        return { error: 'Please give your car a name.' }
    }

    const ids = FEATURES.map(feature => Number(car[`${feature}_id`]))

    if (ids.some(id => !id)) {
        return { error: 'Please choose an option for every feature.' }
    }

    const results = await pool.query('SELECT * FROM options WHERE id = ANY($1::int[])', [ids])
    const selected = FEATURES.map((feature, i) =>
        results.rows.find(option => option.id === ids[i] && option.feature === feature)
    )

    if (selected.some(option => !option)) {
        return { error: 'One or more selected options are invalid.' }
    }

    const convertible = Boolean(car.convertible)

    for (const option of selected) {
        if (option.convertible !== null && option.convertible !== convertible) {
            return {
                error: convertible
                    ? `${option.name} can't be put on a convertible.`
                    : `${option.name} is only available on a convertible.`
            }
        }
    }

    return { price: BASE_PRICE + selected.reduce((total, option) => total + option.price, 0) }
}

const getCars = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM custom_cars ORDER BY id ASC')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getCarById = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM custom_cars WHERE id = $1', [req.params.id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const createCar = async (req, res) => {
    try {
        const { name, convertible, exterior_id, roof_id, wheels_id, interior_id } = req.body
        const { error, price } = await checkCar(req.body)

        if (error) {
            return res.status(400).json({ error })
        }

        const results = await pool.query(
            `INSERT INTO custom_cars (name, convertible, exterior_id, roof_id, wheels_id, interior_id, price)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [name.trim(), Boolean(convertible), exterior_id, roof_id, wheels_id, interior_id, price]
        )

        res.status(201).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const updateCar = async (req, res) => {
    try {
        const { name, convertible, exterior_id, roof_id, wheels_id, interior_id } = req.body
        const { error, price } = await checkCar(req.body)

        if (error) {
            return res.status(400).json({ error })
        }

        const results = await pool.query(
            `UPDATE custom_cars
            SET name = $1, convertible = $2, exterior_id = $3, roof_id = $4, wheels_id = $5, interior_id = $6, price = $7
            WHERE id = $8
            RETURNING *`,
            [name.trim(), Boolean(convertible), exterior_id, roof_id, wheels_id, interior_id, price, req.params.id]
        )

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const deleteCar = async (req, res) => {
    try {
        const results = await pool.query('DELETE FROM custom_cars WHERE id = $1 RETURNING *', [req.params.id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    getCars,
    getCarById,
    createCar,
    updateCar,
    deleteCar
}
