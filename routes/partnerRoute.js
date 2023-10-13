import express from 'express'
const partnerRoute = express()
import partnerController from '../controller/partnerController.js'


partnerRoute.post('/register',partnerController.partnerRegister)
partnerRoute.post('/otp',partnerController.verifyOtp)
partnerRoute.post('/login',partnerController.partnerLogin)
partnerRoute.get('/vehcileList',partnerController.vehicleList)


export default partnerRoute