import express from 'express'
const userRoute = express()
import userController from '../controller/userController.js'
import { protect } from "../middleware/authMiddleware.js";




userRoute.post('/register',userController.userRegister)
userRoute.post('/otp',userController.verifyOtp)
userRoute.post('/login',userController.userLogin)
userRoute.get('/cityList',userController.listCity)
userRoute.get('/profile/:userId',userController.profile)
userRoute.patch('/profileEdit/:userId',protect,userController.profileEdit)
userRoute.get('/vehicleList',userController.vehicleList)
userRoute.post('/forgetPasword',userController.forgetPassword)
userRoute.post('/verifyOtp',userController.verifyforgotOtp)
userRoute.patch('/restPassword',userController.resetPassword)
userRoute.get('/vehicleDetail/:vehicleId',protect,userController.vehicleDetail)
userRoute.get('/coupon',protect,userController.couponData)
userRoute.post('/handleBooking/:userId',protect,userController.handleBooking)
userRoute.post('/bookingCompletion',protect,userController.bookingCompletion)
userRoute.get('/detailBooking/:userId',protect,userController.detailsBooking)
userRoute.put('/cancelBooking/:bookingId',userController.cancelBooking)
userRoute.get('/bookingDetails/:id',protect,userController.bookingData)
userRoute.post('/applyCoupon',protect,userController.applyCoupon)


export default userRoute