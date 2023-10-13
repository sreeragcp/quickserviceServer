import express from 'express'
const userRoute = express()
import userController from '../controller/userController.js'
import { protect } from '../middleware/authMiddleware.js'




userRoute.post('/register',userController.userRegister)
userRoute.post('/otp',userController.verifyOtp)
userRoute.post('/login',userController.userLogin)
userRoute.get('/cityList',userController.listCity)
userRoute.get('/profile/:userId',userController.profile)
userRoute.get('/vehicleList',userController.vehicleList)

export default userRoute