import express from 'express'
import { Login, Logout, LoginConductor} from '../controllers/AuthController'

const router=express.Router()

router.post('/login',Login)
router.post('/login-conductor',LoginConductor)
router.post('/logout', Logout)

export default router