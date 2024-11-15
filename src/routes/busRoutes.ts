import express from 'express'
import { getAllBuses, addBus } from '../controllers/busController'

const router = express.Router()

// Route to get all buses
router.get('/getAllbuses', getAllBuses)

// Route to assign a route to a bus
router.post('/addBus', addBus)

export default router
