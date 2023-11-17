import express from 'express'
const adminRoute = express()
import adminController from '../controller/adminController.js'
import { protectAdmin } from '../middleware/authAdminMiddleware.js'




adminRoute.post('/login',adminController.adminLogin)
adminRoute.post('/addCity',protectAdmin,adminController.addCity)
adminRoute.get('/cityList',protectAdmin,adminController.listCity)
adminRoute.get('/userList',protectAdmin,adminController.userList)
adminRoute.get('/partnersList',protectAdmin,adminController.partnersList)
adminRoute.post('/vehicle',protectAdmin,adminController.vehicle)
adminRoute.get('/vehicleList',protectAdmin,adminController.vehicleList)
adminRoute.patch('/verifyPartner',protectAdmin,adminController.verifyPartner)
adminRoute.post('/coupon',protectAdmin,adminController.addCoupon)
adminRoute.get('/couponList',protectAdmin,adminController.couponList)
adminRoute.get('/detailsBooking',protectAdmin,adminController.detailsBooking)
adminRoute.get('/bookingDetails/:id',protectAdmin,adminController.bookingData)
adminRoute.get('/fetchPartner/:id',protectAdmin,adminController.fetchPartner)
adminRoute.get('/graph',protectAdmin,adminController.getGraphDetails)
adminRoute.get('/bookingDetails',protectAdmin,adminController.getBookingDetails)
adminRoute.get('/getuserRegister',adminController.getUserRegister)



export default adminRoute