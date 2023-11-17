import express from 'express'
const partnerRoute = express()
import partnerController from '../controller/partnerController.js'
import { protectAdmin } from '../middleware/authAdminMiddleware.js'


partnerRoute.post('/register',partnerController.partnerRegister)
partnerRoute.post('/otp',partnerController.verifyOtp)
partnerRoute.post('/login',partnerController.partnerLogin)
partnerRoute.get('/vehcileList',protectAdmin,partnerController.vehicleList)
partnerRoute.get('/partnerData/:partnerId',protectAdmin,partnerController.partnerData)
partnerRoute.patch('/profileEdit/:partnerId',protectAdmin,partnerController.partnerEdit)
partnerRoute.post ('/accept/:id',protectAdmin,partnerController.acceptBooking)
partnerRoute.post ('/reject/:id',protectAdmin,protectAdmin,partnerController.rejectBooking)
partnerRoute.get('/bookingDetails/:partnerId',protectAdmin,partnerController.bookingDetails)
partnerRoute.patch('/updateBooking/:partnerId',protectAdmin,partnerController.updateBooking)
partnerRoute.post('/orderOtp/:partnerId',protectAdmin,partnerController.generateOrderOtp)
partnerRoute.post('/verifyorderOtp/:partnerId',partnerController.verifyPartnerOtp)
partnerRoute.get('/currentBooking/:partnerId',protectAdmin,partnerController.currentBookingData)
partnerRoute.get('/graph',protectAdmin,partnerController.getGraph)


export default partnerRoute