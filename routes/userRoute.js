import express from 'express'
const userRoute = express()
import userController from '../controller/userController.js'
import { protect } from '../middleware/authMiddleware.js'




userRoute.post('/register',userController.userRegister)
userRoute.post('/otp',userController.verifyOtp)
userRoute.post('/login',userController.userLogin)
userRoute.get('/cityList',userController.listCity)
userRoute.get('/profile/:userId',userController.profile)
userRoute.patch('/profileEdit/:userId',userController.profileEdit)
userRoute.get('/vehicleList',userController.vehicleList)
userRoute.post('/forgetPasword',userController.forgetPassword)
userRoute.post('/verifyOtp',userController.verifyforgotOtp)
userRoute.patch('/restPassword',userController.resetPassword)
userRoute.get('/vehicleDetail/:vehicleId',userController.vehicleDetail)
userRoute.get('/coupon',userController.couponData)
userRoute.post('/handleBooking/:userId',userController.handleBooking)
userRoute.post('/bookingCompletion',userController.bookingCompletion)
userRoute.get('/detailBooking/:userId',userController.detailsBooking)
userRoute.patch('/cancelBooking/:bookingId',userController.cancelBooking)
userRoute.get('/bookingDetails/:id',userController.bookingData)

export default userRoute