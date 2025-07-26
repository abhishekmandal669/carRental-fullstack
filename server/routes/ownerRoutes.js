import express from 'express';
import { protect } from '../middleware/auth.js';
import { addCar, changeRoleToOwner, deleteCar, getDashboardData, getOwnerCars, toggleCarAvailability, updateUserImage } from '../controllers/ownerController.js';
import upload from "../middleware/multer.js"

const ownerRoutes = express.Router();

ownerRoutes.post("/change-role", protect, changeRoleToOwner);
ownerRoutes.post("/add-car",protect , upload.single("image"),  addCar);
ownerRoutes.get("/cars", protect, getOwnerCars);
ownerRoutes.post("/toggle-cars", protect, toggleCarAvailability);
ownerRoutes.post("/delete-cars", protect, deleteCar);

ownerRoutes.get('/dashboard' , protect , getDashboardData)
ownerRoutes.post('/update-image', upload.single("image") , protect , updateUserImage)

export default ownerRoutes;