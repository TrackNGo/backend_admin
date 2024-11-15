import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbConfig'
import busRouteRoutes from './routes/busRouteRoutes'
import busRoute from './routes/busRoutes'

dotenv.config()

const app = express()

// Middleware
app.use(express.json())

// Connect to MongoDB
connectDB()

// Routes
app.use('/api-busroutes', busRouteRoutes)
app.use('/api-bus', busRoute)

// Start the server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
