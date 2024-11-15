import { Request, Response } from 'express'
import Bus from '../models/busModel'
import BusRouteModel from '../models/busRouteModel'

export const getAllBuses = async (req: Request, res: Response) => {
    try {
      const buses = await Bus.find()
      res.json(buses)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
}

export const addBus = async (req: Request, res: Response) => {
  const { busNumber, startLocation, endLocation, routeNumber, fareEstimate, type, status } = req.body

  try {
    // Create a new bus using the provided data
    const newBus = new Bus({
      busNumber,
      startLocation,
      endLocation,
      routeNumber,
      fareEstimate,
      type,
      status,
    })

    // Save the new bus to the database
    await newBus.save()

    // Automatically create a bus route using the same bus details
    const newBusRoute = new BusRouteModel({
      busNumber,
      routeNumber,
      startLocation,
      endLocation,
      routeStops: [], // Or you can provide route stops if needed
      status,
    })

    // Save the new bus route
    await newBusRoute.save()

    // Send success response with bus and bus route details
    res.status(201).json({
      message: 'Bus and bus route added successfully',
      bus: newBus,
      busRoute: newBusRoute,
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    })
  }
}
