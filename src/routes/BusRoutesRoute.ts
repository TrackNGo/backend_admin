import express from 'express'
import {createBusRoute, getAllBuses,getBusRouteByBusNumber,updateBusRouteByBusNumber,assignRoute,deleteBusRouteByBusNumber, getBusesByRouteNumber} from '../controllers/BusRouteController'

const router = express.Router()

// Route to get all buses
router.get('/getAllBusRoutes', getAllBuses)

// Route to create a new bus route
router.post('/createBusRoute', createBusRoute);

// Route to get a specific bus route by bus number and route number
router.get('/busRoute/:busNumber', getBusRouteByBusNumber);

// Route to update a specific bus route by bus number and route number
router.put('/busRoute/:busNumber', updateBusRouteByBusNumber);

// Route to delete a specific bus route by bus number and route number
router.delete('/busRoute/:busNumber', deleteBusRouteByBusNumber);

router.get('/busRoute/routenumber/:routeNumber', getBusesByRouteNumber)

// Assign to route for buses
router.put('/assign-route', assignRoute)

export default router
