import express from 'express'
const adminRoute = express()
import adminController from '../controller/adminController.js'




adminRoute.post('/login',adminController.adminLogin)
adminRoute.post('/addCity',adminController.addCity)
adminRoute.get('/cityList',adminController.listCity)
adminRoute.get('/userList',adminController.userList)
adminRoute.get('/partnersList',adminController.partnersList)
adminRoute.post('/vehicle',adminController.vehicle)
adminRoute.get('/vehicleList',adminController.vehicleList)
adminRoute.patch('/verifyPartner',adminController.verifyPartner)
adminRoute.post('/coupon',adminController.addCoupon)
adminRoute.get('/couponList',adminController.couponList)
adminRoute.get('/detailsBooking',adminController.detailsBooking)
adminRoute.get('/bookingDetails/:id',adminController.bookingData)



export default adminRoute