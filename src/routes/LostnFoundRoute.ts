import express from 'express';
import {reportLostItem,reportFoundItem,getAllLostAndFoundItems,getLostAndFoundItemById,updateLostAndFoundItem,deleteLostAndFoundItem,} from '../controllers/LostandFoundController';

const router = express.Router();

// Report a Lost Item
router.post('/lostitem', reportLostItem);

// Report a Found Item
router.post('/founditem', reportFoundItem);

// Get all Lost and Found items
router.get('/items', getAllLostAndFoundItems);

// Get a Lost and Found item by ID
router.get('/item/:id', getLostAndFoundItemById);

// Update a Lost and Found item by ID
router.put('/:id', updateLostAndFoundItem);

// Delete a Lost and Found item by ID
router.delete('/:itemId', deleteLostAndFoundItem);

export default router;
