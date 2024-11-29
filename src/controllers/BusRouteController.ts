import { Request, Response } from 'express'
import BusRouteModel from '../models/BusRouteModel'

export const createBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber, startLocation, endLocation, routeStops } = req.body;
    try {
        // Validate input
        if (!busNumber || !routeNumber || !startLocation || !endLocation || !routeStops) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if bus route already exists
        const existingRoute = await BusRouteModel.findOne({ busNumber, routeNumber });
        if (existingRoute) {
            return res.status(409).json({ message: 'Route already exists for the bus' });
        }
        // Create and save new bus route
        const newBusRoute = new BusRouteModel({ busNumber, routeNumber, startLocation, endLocation, routeStops });
        await newBusRoute.save();
        res.status(201).json({ message: 'Bus route created successfully', busRoute: newBusRoute });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while creating the bus route.', error: error.message || 'Internal Server Error',
        });
    }
};


//Get all buses with routes
export const getAllBuses = async (req: Request, res: Response): Promise<any> => {
    try {
        // Attempt to fetch all buses from the BusRouteModel
        const buses = await BusRouteModel.find()

        // If no buses are found, send a 404 response with a message
        if (!buses || buses.length === 0) {
            return res.status(404).json({ message: 'No buses found' })
        }

        // Send the list of buses as a response
        return res.status(200).json(buses)
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching the buses.', error: error.message || 'Internal Server Error',
        })
    }
}


export const getBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber } = req.params;
    try {
        const busRoute = await BusRouteModel.findOne({ busNumber, routeNumber });
        if (!busRoute) {
            return res.status(404).json({ message: 'Bus route not found' });
        }
        res.status(200).json(busRoute);
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching the bus route.', error: error.message || 'Internal Server Error',
        });
    }
};

export const updateBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber } = req.params;
    const updates = req.body;
    try {
        const busRoute = await BusRouteModel.findOneAndUpdate({ busNumber, routeNumber }, updates, { new: true });
        if (!busRoute) {
            return res.status(404).json({ message: 'Bus route not found' });
        }
        res.status(200).json({ message: 'Bus route updated successfully', busRoute });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while updating the bus route.',
            error: error.message || 'Internal Server Error',
        });
    }
};


// Assign bus route for bus using bus number
export const assignRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeStops } = req.body

    try {
        // Ensure routeStops is provided and is an array
        if (!Array.isArray(routeStops) || routeStops.length === 0) {
            return res.status(400).json({ error: 'Invalid route stops data. Please provide a non-empty array.' })
        }

        // Find the bus by its busNumber
        const bus = await BusRouteModel.findOne({ busNumber })

        // If the bus is not found, return an error response
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' })
        }

        // Update the bus's routeStops with the new value
        bus.routeStops = routeStops

        // Save the updated bus document
        await bus.save()

        // Return success response with the updated bus details
        res.status(200).json({ message: 'Route stops updated successfully', bus })
    } catch (error: any) {
        // Log the error for debugging purposes
        console.error('Error updating route stops:', error)

        // Handle database-related errors or unexpected issues
        res.status(500).json({ message: 'An error occurred while updating route stops', error: error.message })
    }
}


export const deleteBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber } = req.params;
    try {
        const busRoute = await BusRouteModel.findOneAndDelete({ busNumber, routeNumber });
        if (!busRoute) {
            return res.status(404).json({ message: 'Bus route not found' });
        }
        res.status(200).json({ message: 'Bus route deleted successfully' });
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while deleting the bus route.',
            error: error.message || 'Internal Server Error',
        });
    }
};

