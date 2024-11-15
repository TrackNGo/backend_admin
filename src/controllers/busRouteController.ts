import { Request, Response } from 'express'
import Bus from '../models/busRouteModel'

export const getAllBuses = async (req: Request, res: Response) => {
  try {
    const buses = await Bus.find()
    res.json(buses)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

export const assignRoute = async (req: Request, res: Response): Promise<void> => {
  const { busNumber, routeStops } = req.body

  try {
    // Find the bus by its busNumber
    const bus = await Bus.findOne({ busNumber })

    // If the bus is not found, return an error response
    if (!bus) {
      res.status(404).json({ error: 'Bus not found' })
      return
    }

    // Update the bus's routeStops with the new value
    bus.routeStops = routeStops

    // Save the updated bus document
    await bus.save()

    // Return success response with the updated bus
    res.json({ message: 'Route stops updated successfully', bus })
  } catch (error: any) {
    // Handle errors and return the error message
    res.status(500).json({ error: error.message })
  }
}
