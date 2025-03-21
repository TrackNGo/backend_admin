import express from 'express';
import { addFareToRoute, deleteFareEstimate, getFareEstimates, updateFareEstimate, getFareEstimateById, searchFareEstimateByLocations } from '../controllers/FareEstiController';

const router = express.Router();

// Route to add a fare between two stops on the bus route
router.post('/add', addFareToRoute);

router.get('/view', getFareEstimates)

router.get('/view/:id', getFareEstimateById)

router.get('/locations', searchFareEstimateByLocations)

// Route to delete fare for a specific stop on the bus route
router.delete('/delete/:id', deleteFareEstimate);

// Route to update fare for a specific stop on the bus route
router.put('/update/:id', updateFareEstimate);

export default router;
