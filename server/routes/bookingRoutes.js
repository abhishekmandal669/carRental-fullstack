import express from "express";
import { protect } from "../middleware/auth.js"
import { changeBookingStatus, checkCarAvailability, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";

const bookingRoutes = express.Router();

bookingRoutes.post('/check-availability' , checkCarAvailability)
bookingRoutes.post('/create' , protect , createBooking)
bookingRoutes.get('/user' , protect , getUserBookings)
bookingRoutes.get('/owner' , protect , getOwnerBookings)
bookingRoutes.post('/change-status' , protect , changeBookingStatus)

export default bookingRoutes;