import express from 'express';
import {reportLostItem,reportFoundItem,getAllLostAndFoundItems,getLostAndFoundItemById,updateLostAndFoundItem,deleteLostAndFoundItem,} from '../controllers/LostandFoundController';

const router = express.Router();

// Report a Lost Item
router.post('/reportLostItem', reportLostItem);

// Report a Found Item
router.post('/reportFoundItem', reportFoundItem);

// Get all Lost and Found items
router.get('/getAllItems', getAllLostAndFoundItems);

// Get a Lost and Found item by ID
router.get('/getItem/:itemId', getLostAndFoundItemById);

// Update a Lost and Found item by ID
router.put('/updateItem/:itemId', updateLostAndFoundItem);

// Delete a Lost and Found item by ID
router.delete('/deleteItem/:itemId', deleteLostAndFoundItem);

export default router;
