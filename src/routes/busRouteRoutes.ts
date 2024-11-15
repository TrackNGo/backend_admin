import express from 'express'
import { getAllBuses, assignRoute } from '../controllers/busRouteController'

const router = express.Router()

router.get('/buses', getAllBuses)
router.put('/assign-route', assignRoute)

export default router
