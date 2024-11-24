import express from 'express'
import connectDB from './config/dbConfig'
import dotenv from 'dotenv'

import userRoutes from './routes/UserRoute'
import authRoutes from './routes/AuthRoute'
import busRoutes from './routes/BusRoute'

dotenv.config()
const app = express()
app.use(express.json())

const PORT= process.env.PORT || 3000

connectDB()

app.use('/api-user', authRoutes)
app.use('/api-user', userRoutes)
app.use('/api-bus', busRoutes)
app.use('/api-busroutes', busRouteRoutes)
// app.use('/api-busFare', busFare)



app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

