import { FEATURES, getOption } from './calcprice'

// an option's `convertible` flag is null when it fits any body style,
// true when it only fits a convertible, and false when it only fits a coupe
export const getCarErrors = (car, options) => {
    const errors = []

    if (!car.name || !car.name.trim()) {
        errors.push('Please give your car a name.')
    }

    for (const feature of FEATURES) {
        const option = getOption(options, car[`${feature}_id`])

        if (!option) {
            errors.push(`Please choose a ${feature} option.`)
        }
        else if (option.convertible !== null && option.convertible !== car.convertible) {
            errors.push(car.convertible
                ? `${option.name} can't be put on a convertible. Choose a convertible roof or uncheck Convertible.`
                : `${option.name} is only available on a convertible. Check Convertible or choose a hardtop roof.`
            )
        }
    }

    return errors
}
