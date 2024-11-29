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

// export const updateBusRoute = async (req: Request, res: Response): Promise<any> => {
//     const { busNumber, routeNumber } = req.params;
//     const updates = req.body;

//     try {
//         // Validate required parameters
//         if (!busNumber || !routeNumber) {
//             return res.status(400).json({ message: 'Bus number and route number are required' });
//         }

//         // Validate request body
//         if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
//             return res.status(400).json({ message: 'No valid fields provided to update' });
//         }

//         // Define allowed fields for updates
//         const allowedFields = ['startLocation', 'endLocation', 'routeStops'];
//         const validUpdates = Object.keys(updates).reduce((acc: any, key) => {
//             if (allowedFields.includes(key)) {
//                 acc[key] = updates[key];
//             }
//             return acc;
//         }, {});

//         // If no valid fields are present, return an error
//         if (Object.keys(validUpdates).length === 0) {
//             return res.status(400).json({ message: 'No valid fields to update' });
//         }

//         // Find and update the bus route
//         const busRoute = await BusRouteModel.findOneAndUpdate(
//             { busNumber, routeNumber },
//             validUpdates,
//             { new: true, runValidators: true }
//         );

//         if (!busRoute) {
//             return res.status(404).json({ message: 'Bus route not found' });
//         }

//         res.status(200).json({ message: 'Bus route updated successfully', busRoute });
//     } catch (error: any) {
//         res.status(500).json({
//             message: 'An error occurred while updating the bus route.',
//             error: error.message || 'Internal Server Error',
//         });
//     }
// };

// @note Take index from req body for the routeStops array
export const updateBusRoute = async (req: Request, res: Response): Promise<any> => {
    const { busNumber, routeNumber } = req.params;
    const updates = req.body;

    try {
        // Validate required parameters
        if (!busNumber || !routeNumber) {
            return res.status(400).json({ message: 'Bus number and route number are required' });
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

        // Handle `routeStops` updates
        if (validUpdates.routeStops) {
            const { index, newStop } = validUpdates.routeStops;

            // Fetch the bus route
            const busRoute = await BusRouteModel.findOne({ busNumber, routeNumber });
            if (!busRoute) {
                return res.status(404).json({ message: 'Bus route not found' });
            }

            // Ensure `routeStops` is an array in the document
            if (!Array.isArray(busRoute.routeStops)) {
                busRoute.routeStops = [];
            }

            if (typeof index === 'number' && index >= 0 && index < busRoute.routeStops.length) {
                // Update an existing route stop at the specified index
                busRoute.routeStops[index] = newStop;
            } else if (newStop) {
                // Add a new route stop to the end of the array
                busRoute.routeStops.push(newStop);
            } else {
                return res.status(400).json({ message: 'Invalid routeStops update request' });
            }

            // Save the updated bus route
            await busRoute.save();
            return res.status(200).json({ message: 'Bus route updated successfully', busRoute });
        }

        // For non-routeStops fields, update the bus route directly
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

