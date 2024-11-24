import express from 'express';
import {addFareToRoute,deleteFareForStop,updateFareForStop} from '../controllers/FareEstiController';

const router = express.Router();

// Route to add a fare between two stops on the bus route
router.post('/addFareToRoute', addFareToRoute);

// Route to delete fare for a specific stop on the bus route
router.delete('/deleteFareForStop', deleteFareForStop);

// Route to update fare for a specific stop on the bus route
router.put('/updateFareForStop', updateFareForStop);

export default router;
