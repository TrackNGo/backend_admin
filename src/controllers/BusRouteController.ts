import { Request, Response } from 'express'
import BusRouteModel from '../models/BusRouteModel'
import { AnyARecord } from 'dns';


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
        res.status(500).json({message: 'An error occurred while creating the bus route.',error: error.message || 'Internal Server Error',
    });
}
};


//Get all buses with routes
export const getAllBuses = async (req: Request, res: Response): Promise<any> => {
    try {
        const buses = await BusRouteModel.find();
    if (!buses || buses.length === 0) {
        return res.status(404).json({ message: 'No buses found' });
    }

    return res.status(200).json(buses);
    } catch (error: any) {
        res.status(500).json({message: 'An error occurred while fetching the buses.',error: error.message || 'Internal Server Error',
    });
    }
};
