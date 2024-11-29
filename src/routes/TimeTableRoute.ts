import express from 'express'
import { getAllTimeTable } from '../controllers/TimeTableController'

const router=express.Router()

router.get('/gettimetable',getAllTimeTable)

export default router