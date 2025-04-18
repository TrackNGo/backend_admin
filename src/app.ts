import express from 'express'
import connectDB from './config/dbConfig'
import dotenv from 'dotenv'

import userRoutes from './routes/UserRoute'
import authRoutes from './routes/AuthRoute'
import busRoutes from './routes/BusRoute'
import busRouteRoutes from './routes/BusRoutesRoute'
import busFare from './routes/FareRoute'
import lostnFound from './routes/LostnFoundRoute'
import busTimeTable from './routes/TimeTableRoute'
import reportRoutes from './routes/ReportRoute'
import contactRoutes from './routes/formSubmissionRoute'
import cors from 'cors'

import { AuthMiddleware } from './middleware/AuthMiddleware'

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())

const PORT= process.env.PORT || 3000

connectDB()

app.use('/api-user', authRoutes)
app.use('/api-user', userRoutes)
app.use('/api-bus', busRoutes)
app.use('/api-busroutes', busRouteRoutes)
app.use('/api-lostnFound', lostnFound)
app.use('/api-bustimetable',busTimeTable)
app.use('/api-fare', busFare)
app.use('/api-report', reportRoutes)
app.use('/api-contact', contactRoutes)

// Middleware set
//app.use(AuthMiddleware)

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

