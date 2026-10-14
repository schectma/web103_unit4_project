const API_URL = '/api/options'

const request = async (url) => {
    const response = await fetch(url)
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`)
    }

    return data
}

const getAllOptions = () => request(API_URL)

const getOption = (id) => request(`${API_URL}/${id}`)

export default {
    getAllOptions,
    getOption
}
