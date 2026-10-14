const API_URL = '/api/cars'

// throws the server's error message (if any) so pages can show it to the user
const request = async (url, options = {}) => {
    const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...options
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    return data
}

const getAllCars = () => request(API_URL)

const getCar = (id) => request(`${API_URL}/${id}`)

const createCar = (car) => request(API_URL, {
    method: 'POST',
    body: JSON.stringify(car)
})

const updateCar = (id, car) => request(`${API_URL}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(car)
})

const deleteCar = (id) => request(`${API_URL}/${id}`, {
    method: 'DELETE'
})

export default {
    getAllCars,
    getCar,
    createCar,
    updateCar,
    deleteCar
}
