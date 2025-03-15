import express from 'express';
import { addFareToRoute, deleteFareForStop, getFareEstimates, updateFareForStop } from '../controllers/FareEstiController';

const router = express.Router();

// Route to add a fare between two stops on the bus route
router.post('/add', addFareToRoute);

router.get('/view', getFareEstimates)

// Route to delete fare for a specific stop on the bus route
router.delete('/delete', deleteFareForStop);

// Route to update fare for a specific stop on the bus route
router.put('/update', updateFareForStop);

export default router;
