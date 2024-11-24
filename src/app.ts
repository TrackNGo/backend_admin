import express from 'express'
import connectDB from './config/dbConfig'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
app.use(express.json())

const PORT= process.env.PORT || 3000

connectDB()

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})

