import express from 'express'
const partnerRoute = express()
import partnerController from '../controller/partnerController.js'
import { protectPartner } from '../middleware/authPartnerMiddleware.js'


partnerRoute.post('/register',partnerController.partnerRegister)
partnerRoute.post('/otp',partnerController.verifyOtp)
partnerRoute.post('/login',partnerController.partnerLogin)
partnerRoute.get('/vehcileList',protectPartner,partnerController.vehicleList)
partnerRoute.get('/partnerData/:partnerId',protectPartner,partnerController.partnerData)
partnerRoute.patch('/profileEdit/:partnerId',protectPartner,partnerController.partnerEdit)
partnerRoute.post ('/accept/:id',protectPartner,partnerController.acceptBooking)
partnerRoute.post ('/reject/:id',protectPartner,partnerController.rejectBooking)
partnerRoute.get('/bookingDetails/:partnerId',protectPartner,partnerController.bookingDetails)
partnerRoute.patch('/updateBooking/:partnerId',protectPartner,partnerController.updateBooking)
partnerRoute.post('/orderOtp/:partnerId',protectPartner,partnerController.generateOrderOtp)
partnerRoute.post('/verifyorderOtp/:partnerId',partnerController.verifyPartnerOtp)
partnerRoute.get('/currentBooking/:partnerId',protectPartner,partnerController.currentBookingData)
partnerRoute.get('/graph',protectPartner,partnerController.getGraph)


export default partnerRoute