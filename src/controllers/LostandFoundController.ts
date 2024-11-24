import { Request, Response } from 'express';
import LostAndFoundItemModel from '../models/LostNfoundModel';

// Report a Lost Item
export const reportLostItem = async (req: Request, res: Response): Promise<any> => {
    const { description, location, busRoute, contactDetails } = req.body;

    try {
        // Validate request data
        if (!description || !location || !busRoute || !contactDetails) {
            return res.status(400).json({ message: 'All fields are required: description, location, busRoute, contactDetails' });
        }

        // Create a new Lost item
        const lostItem = new LostAndFoundItemModel({
            description,
            location,
            busRoute,
            contactDetails,
            status: 'lost', 
        });

        // Save the lost item to the database
        await lostItem.save();

        res.status(201).json({ message: 'Lost item reported successfully', item: lostItem });
    } catch (error: any) {
        console.error('Error reporting lost item:', error);
        res.status(500).json({ message: 'Failed to report lost item', error: error.message || 'Internal Server Error' });
    }
};

// Report a Found Item
export const reportFoundItem = async (req: Request, res: Response): Promise<any> => {
    const { description, location, busRoute, contactDetails } = req.body;

    try {
        // Validate request data
        if (!description || !location || !busRoute || !contactDetails) {
            return res.status(400).json({ message: 'All fields are required: description, location, busRoute, contactDetails' });
        }

        // Create a new Found item
        const foundItem = new LostAndFoundItemModel({
            description,
            location,
            busRoute,
            contactDetails,
            status: 'found', 
        });

        await foundItem.save();

        res.status(201).json({ message: 'Found item reported successfully', item: foundItem });
    } catch (error: any) {
        console.error('Error reporting found item:', error);
        res.status(500).json({ message: 'Failed to report found item', error: error.message || 'Internal Server Error' });
    }
};

// Get all Lost and Found items
export const getAllLostAndFoundItems = async (req: Request, res: Response): Promise<any> => {
    try {
        const items = await LostAndFoundItemModel.find();

        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No lost and found items found' });
        }

        res.status(200).json({ items });
    } catch (error: any) {
        console.error('Error fetching lost and found items:', error);
        res.status(500).json({ message: 'An error occurred while fetching lost and found items', error: error.message || 'Internal Server Error' });
    }
};

// Get a specific Lost and Found item by ID
export const getLostAndFoundItemById = async (req: Request, res: Response): Promise<any> => {
    const { itemId } = req.params;

    try {
        const item = await LostAndFoundItemModel.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Lost and found item not found' });
        }

        res.status(200).json({ item });
    } catch (error: any) {
        console.error('Error fetching lost and found item by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching the lost and found item', error: error.message || 'Internal Server Error' });
    }
};

// Update a Lost and Found item by ID
export const updateLostAndFoundItem = async (req: Request, res: Response): Promise<any> => {
    const { itemId } = req.params;
    const { description, location, busRoute, contactDetails, status } = req.body;

    try {
        // Validate data
        if (!description || !location || !busRoute || !contactDetails || !status) {
            return res.status(400).json({ message: 'All fields are required to update the item' });
        }

        // Update the Lost/Found item
        const updatedItem = await LostAndFoundItemModel.findByIdAndUpdate(itemId, {
            description,
            location,
            busRoute,
            contactDetails,
            status,
        }, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ message: 'Lost and found item not found' });
        }

        res.status(200).json({ message: 'Lost and found item updated successfully', item: updatedItem });
    } catch (error: any) {
        console.error('Error updating lost and found item:', error);
        res.status(500).json({ message: 'An error occurred while updating the lost and found item', error: error.message || 'Internal Server Error' });
    }
};

// Delete a Lost and Found item by ID
export const deleteLostAndFoundItem = async (req: Request, res: Response): Promise<any> => {
    const { itemId } = req.params;

    try {
        const deletedItem = await LostAndFoundItemModel.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Lost and found item not found' });
        }

        res.status(200).json({ message: 'Lost and found item deleted successfully', item: deletedItem });
    } catch (error: any) {
        console.error('Error deleting lost and found item:', error);
        res.status(500).json({ message: 'An error occurred while deleting the lost and found item', error: error.message || 'Internal Server Error' });
    }
};
