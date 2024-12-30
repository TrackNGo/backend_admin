import express from 'express'
import { getAllBuses, addBus, deleteBusByBusNumber, getBusByBusNumber, updateBusDetails, getBusesByRouteNumber, updateBusStatus, countTotalBuses, activeBuses ,nonActiveBuses} from '../controllers/BusController'

const router = express.Router()

// Get all buses
router.get('/buses', getAllBuses)

// Add a bus
router.post('/bus', addBus)

// Route to get bus by busNumber
router.get('/bus/:busNumber', getBusByBusNumber)

//Update details by bus number
router.put('/bus/:busNumber', updateBusDetails)

// Route to delete bus by busNumber
router.delete('/bus/:busNumber', deleteBusByBusNumber)

//get buses by route number
router.get('/bus/routenumber/:routeNumber', getBusesByRouteNumber)

//bus status update using bus number
router.put('/bus/status/:busNumber', updateBusStatus)

router.get('/totalBuses', countTotalBuses)

router.get('/activeBuses', activeBuses)

router.get('/nonActiveBuses', nonActiveBuses)


export default router;