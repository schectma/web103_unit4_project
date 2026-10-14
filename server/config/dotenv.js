import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// resolved against this file so the .env is found no matter which
// directory the script was launched from (server/ or server/config/)
dotenv.config({ path: path.resolve(__dirname, '../.env') })
