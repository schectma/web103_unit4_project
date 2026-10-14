import './dotenv.js'
import { pool } from './database.js'

// convertible: null = works with any body style,
// true = only works on a convertible, false = only works on a coupe
const options = [
    { feature: 'exterior', name: 'Torch Red', price: 0, color: '#b3121b', convertible: null },
    { feature: 'exterior', name: 'Arctic White', price: 0, color: '#eef1f4', convertible: null },
    { feature: 'exterior', name: 'Black', price: 0, color: '#16171a', convertible: null },
    { feature: 'exterior', name: 'Rapid Blue', price: 995, color: '#1f6fd1', convertible: null },
    { feature: 'exterior', name: 'Accelerate Yellow', price: 995, color: '#f4c20d', convertible: null },
    { feature: 'exterior', name: 'Amplify Orange', price: 1495, color: '#e8641b', convertible: null },

    { feature: 'roof', name: 'Body-Color Hardtop', price: 0, color: null, convertible: false },
    { feature: 'roof', name: 'Carbon Fiber Hardtop', price: 2495, color: '#2b2b2b', convertible: false },
    { feature: 'roof', name: 'Transparent Glass Hardtop', price: 1995, color: '#8fc6e8', convertible: false },
    { feature: 'roof', name: 'Black Soft Top', price: 0, color: '#111111', convertible: true },
    { feature: 'roof', name: 'Retractable Hardtop', price: 3995, color: null, convertible: true },

    { feature: 'wheels', name: 'Silver Spoke', price: 0, color: '#c7ccd1', convertible: null },
    { feature: 'wheels', name: 'Gloss Black', price: 995, color: '#101010', convertible: null },
    { feature: 'wheels', name: 'Bronze Forged', price: 2495, color: '#9c6b30', convertible: null },
    { feature: 'wheels', name: 'Machined Gold', price: 3495, color: '#d4af37', convertible: null },

    { feature: 'interior', name: 'Jet Black', price: 0, color: '#1b1b1b', convertible: null },
    { feature: 'interior', name: 'Adrenaline Red', price: 1495, color: '#8e1b1b', convertible: null },
    { feature: 'interior', name: 'Sky Cool Gray', price: 1495, color: '#9aa0a6', convertible: null },
    { feature: 'interior', name: 'Natural Tan', price: 1995, color: '#c19a6b', convertible: null }
]

const createTables = async () => {
    const createTablesQuery = `
        DROP TABLE IF EXISTS custom_cars;
        DROP TABLE IF EXISTS options;

        CREATE TABLE IF NOT EXISTS options (
            id SERIAL PRIMARY KEY,
            feature VARCHAR(50) NOT NULL,
            name VARCHAR(255) NOT NULL,
            price INTEGER NOT NULL,
            color VARCHAR(7),
            convertible BOOLEAN
        );

        CREATE TABLE IF NOT EXISTS custom_cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            convertible BOOLEAN NOT NULL DEFAULT FALSE,
            exterior_id INTEGER NOT NULL REFERENCES options(id),
            roof_id INTEGER NOT NULL REFERENCES options(id),
            wheels_id INTEGER NOT NULL REFERENCES options(id),
            interior_id INTEGER NOT NULL REFERENCES options(id),
            price INTEGER NOT NULL
        );
    `

    try {
        await pool.query(createTablesQuery)
        console.log('🎉 options and custom_cars tables created successfully')
    }
    catch (err) {
        console.error('⚠️ error creating tables', err)
    }
}

const seedTables = async () => {
    await createTables()

    // sequential so the serial ids line up with the order above
    for (const option of options) {
        try {
            await pool.query(
                'INSERT INTO options (feature, name, price, color, convertible) VALUES ($1, $2, $3, $4, $5)',
                [option.feature, option.name, option.price, option.color, option.convertible]
            )
            console.log(`✅ ${option.feature} option ${option.name} added successfully`)
        }
        catch (err) {
            console.error('⚠️ error inserting option', err)
        }
    }

    await pool.end()
}

seedTables()
