import express from 'express'
const partnerRoute = express()
import partnerController from '../controller/partnerController.js'


partnerRoute.post('/register',partnerController.partnerRegister)
partnerRoute.post('/otp',partnerController.verifyOtp)
partnerRoute.post('/login',partnerController.partnerLogin)
partnerRoute.get('/vehcileList',partnerController.vehicleList)
partnerRoute.get('/partnerData/:partnerId',partnerController.partnerData)
partnerRoute.patch('/profileEdit/:partnerId',partnerController.partnerEdit)
partnerRoute.post ('/accept/:id',partnerController.acceptBooking)
partnerRoute.post ('/reject/:id',partnerController.rejectBooking)
partnerRoute.get('/bookingDetails/:partnerId',partnerController.bookingDetails)
partnerRoute.patch('/updateBooking/:partnerId',partnerController.updateBooking)
partnerRoute.post('/orderOtp/:partnerId',partnerController.generateOrderOtp)
partnerRoute.post('/verifyorderOtp/:partnerId',partnerController.verifyPartnerOtp)
partnerRoute.get('/currentBooking/:partnerId',partnerController.currentBookingData)


export default partnerRoute