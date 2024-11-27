import express from 'express'
import { getAllBuses, addBus, deleteBusByBusNumber, getBusByBusNumber,updateBusDetails } from '../controllers/BusController'

const router = express.Router()

// Get all buses
router.get('/buses', getAllBuses)

// Add a bus
router.post('/buses', addBus)

// Route to get bus by busNumber
router.get('/bus/:busNumber', getBusByBusNumber)

//Update details by bus number
router.put('/bus/:busNumber', updateBusDetails)

// Route to delete bus by busNumber
router.delete('/bus/:busNumber', deleteBusByBusNumber)

export default router;