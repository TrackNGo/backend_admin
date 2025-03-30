import { Request, Response } from 'express'
import BusRouteModel from '../models/BusRouteModel'

// @note bus route controllers tested and documentation created

export const createBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber, startLocation, endLocation, routeStops } = req.body;
    try {
        // Validate input
        // console.log(busNumber, routeNumber, startLocation, endLocation, routeStops)
        if (!busNumber || !routeNumber || !startLocation || !endLocation || !routeStops) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if bus route already exists
        const existingRoute = await BusRouteModel.findOne({ busNumber, routeNumber });
        
        if (existingRoute) {
            const updatedBusRoute = await BusRouteModel.updateOne(
                { busNumber: busNumber },
                { $set: { routeNumber: routeNumber, startLocation: startLocation, endLocation: endLocation, routeStops: routeStops } }
            )
            res.status(201).json({ message: 'Bus route updated successfully', busRoute: updatedBusRoute });
        }
        else {

            // Create and save new bus route
            const newBusRoute = new BusRouteModel({ busNumber, routeNumber, startLocation, endLocation, routeStops });
            await newBusRoute.save();
            res.status(201).json({ message: 'Bus route created successfully', busRoute: newBusRoute });
        }
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

//get bus by bus number
export const getBusRouteByBusNumber = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params
    try {
        const busRoute = await BusRouteModel.findOne({ busNumber })
        if (!busRoute) {
            return res.status(404).json({ message: 'Bus route not found' })
        }
        res.status(200).json(busRoute)
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching the bus route.', error: error.message || 'Internal Server Error',
        });
    }
}

//get bus by bus route number
export const getBusesByRouteNumber = async (req: Request, res: Response): Promise<any> => {
    const { routeNumber } = req.params
    try {
        const busRoutes = await BusRouteModel.find({ routeNumber })
        if (busRoutes.length === 0) {
            return res.status(404).json({ message: 'No buses found for this route number' })
        }
        res.status(200).json(busRoutes)
    } catch (error: any) {
        res.status(500).json({
            message: 'An error occurred while fetching buses for the route.',
            error: error.message || 'Internal Server Error',
        })
    }
}

/*
export const updateBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params;
    const updates = req.body;

    try {
        // Validate required parameters
        if (!busNumber) {
            return res.status(400).json({ message: 'Bus number required' });
        }

        // Validate request body
        if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No valid fields provided to update' });
        }

        // Define allowed fields for updates
        const allowedFields = ['startLocation', 'endLocation', 'routeStops'];
        const validUpdates = Object.keys(updates).reduce((acc: any, key) => {
            if (allowedFields.includes(key)) {
                acc[key] = updates[key];
            }
            return acc;
        }, {});

        // If no valid fields are present, return an error
        if (Object.keys(validUpdates).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        // Find and update the bus route
        const busRoute = await BusRouteModel.findOneAndUpdate(
            { busNumber, routeNumber },
            validUpdates,
            { new: true, runValidators: true }
        );

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
};*/

// @note Take index from req body for the routeStops array
// update bus route
export const updateBusRouteByBusNumber = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params // Extract busNumber from the route params
    const updates = req.body // Extract updates from the request body

    try {
        // Validate updates: Define allowed update fields
        const allowedFields = ['routeNumber', 'startLocation', 'endLocation', 'routeStops']
        const filteredUpdates: Partial<Record<string, any>> = {}

        Object.keys(updates).forEach((key) => {
            if (allowedFields.includes(key)) {
                filteredUpdates[key] = updates[key]
            }
        })

        if (Object.keys(filteredUpdates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update." })
        }

        // Perform the update
        const updatedBusRoute = await BusRouteModel.findOneAndUpdate(
            { busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } }, // Ensure busNumber is trimmed and matches
            filteredUpdates,
            { new: true, runValidators: true } // Return the updated document and run validation
        )

        if (!updatedBusRoute) {
            return res.status(404).json({ message: `Bus route with busNumber '${busNumber}' not found.` })
        }

        // Respond with the updated bus route
        res.status(200).json({
            message: "Bus route updated successfully.",
            busRoute: updatedBusRoute,
        })
    } catch (error: any) {
        console.error("Error updating bus route:", error.message)
        res.status(500).json({
            message: "An error occurred while updating the bus route.",
            error: error.message || "Internal Server Error",
        })
    }
}


// Assign bus route for bus using bus number
export const assignRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeStops } = req.body

    try {
        // Ensure routeStops is provided and is an array
        if (!Array.isArray(routeStops) || routeStops.length === 0) {
            return res.status(400).json({ error: 'Invalid route stops data. Please provide a non-empty array.' })
        }

        // Find the bus by its busNumber
        const bus = await BusRouteModel.findOne({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } })

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


export const deleteBusRouteByBusNumber = async (req: Request, res: Response): Promise<any> => {
    const { busNumber } = req.params
    try {
        const busRoute = await BusRouteModel.findOneAndDelete({ busNumber: { $regex: new RegExp(`^${busNumber}$`, 'i') } });
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

