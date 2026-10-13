export const BASE_PRICE = 65000

export const FEATURES = ['exterior', 'roof', 'wheels', 'interior']

export const getOption = (options, id) =>
    options.find(option => option.id === Number(id))

export const getOptionPrice = (options, id) =>
    getOption(options, id)?.price ?? 0

export const calcTotalPrice = (car, options) =>
    FEATURES.reduce(
        (total, feature) => total + getOptionPrice(options, car[`${feature}_id`]),
        BASE_PRICE
    )

export const formatPrice = (price) =>
    `$${Number(price).toLocaleString('en-US')}`
