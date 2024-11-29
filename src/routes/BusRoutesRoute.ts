import express from 'express'
import {createBusRoute, getAllBuses,getBusRoute,updateBusRoute,assignRoute,deleteBusRoute,} from '../controllers/BusRouteController'

const router = express.Router()

// Route to get all buses
router.get('/bus/route', getAllBuses)

// Route to create a new bus route
router.post('/bus/route', createBusRoute);

// Route to get a specific bus route by bus number and route number
router.get('/:busNumber/:routeNumber', getBusRoute);

// Route to update a specific bus route by bus number and route number
router.put('/:busNumber/:routeNumber', updateBusRoute);

// Route to delete a specific bus route by bus number and route number
router.delete('/:busNumber/:routeNumber', deleteBusRoute);

// Assign to route for buses
router.put('/assign-route', assignRoute)

export default router
