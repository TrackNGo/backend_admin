import { Request, Response } from 'express'
import Bus from '../models/busModel'

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
    const newBus = new Bus({
      busNumber,
      startLocation,
      endLocation,
      routeNumber,
      fareEstimate,
      type,
      status,
    })

    await newBus.save()

    res.status(201).json({
      message: 'Bus added successfully',
      bus: newBus,
    })
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
    })
  }
}
