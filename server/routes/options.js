import express from 'express'
import OptionsController from '../controllers/options.js'

const router = express.Router()

router.get('/', OptionsController.getOptions)
router.get('/:id', OptionsController.getOptionById)

export default router
