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
    const bus = await Bus.findOne({ busNumber })

    if (!bus) {
      res.status(404).json({ error: 'Bus not found' })
      return
    }

    bus.routeStops = routeStops
    await bus.save()

    res.json({ message: 'Route stops updated successfully', bus })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
