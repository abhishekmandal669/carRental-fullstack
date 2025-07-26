import User from "../models/User.js";
import fs from 'fs';
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import imagekit from "../configs/imageKit.js";



export const changeRoleToOwner = async (req, res) => {
    try{
        const {_id}= req.user;
        await User.findByIdAndUpdate(_id, {role: 'owner'});
        res.json({success: true, message: 'Now you can list your cars'});
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Api to list cars

export const addCar = async (req, res) => {

    try{
        const {_id} = req.user;
        let car =JSON.parse(req.body.carData);
        const imageFile = req.file;


        //uplode image kit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const response = await imagekit.upload({
            file:fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: "1280"} ,
                {quality: "auto"}, //Auto compression
                {format: "webp"} // Convert to modern format
        ]
    });

    const image = optimizedImageUrl;
    await Car.create({...car, owner: _id , image});

    res.json({success:true , message: 'Car added successfully'});

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Api to list owner cars

export const getOwnerCars = async (req, res) => {
    try{
        const {_id} = req.user;
        const cars = await Car.find({owner: _id});
        res.json({success: true, cars});

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Api to delete owner car

export const toggleCarAvailability = async (req, res) => {
    try{
        const{_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);
        //checking id car belongs to owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'You are not authorized to perform this action'});
        }

        car.isAvailable = !car.isAvailable;
        await car.save();
        res.json({success: true, message: 'Car availability toggled successfully'});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Api to delete owner car

export const  deleteCar= async (req, res) => {
    try{
        const{_id} = req.user;
        const {carId} = req.body;
        const car = await Car.findById(carId);
        //checking id car belongs to owner
        if(car.owner.toString() !== _id.toString()){
            return res.json({success: false, message: 'You are not authorized to perform this action'});
        }

        car.owner = null; // Remove owner reference
        car.isAvailable = false; // Set availability to false
        await car.save();
        res.json({success: true, message: 'Car deleted successfully'});
    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

//Api to get Dashboard data

export const getDashboardData = async (req, res) => {
    try {
        const {_id , role} = req.user;

        if(role !== 'owner') {
            return res.json({success: false, message: 'Not authorized'});
        }

        const cars = await Car.find({owner: _id});
        const booking = await Booking.find({owner:_id}).populate('car').sort({ createdAt: -1});

        const pendingBookings = await Booking.find({owner: _id, status:"pending"})

        const completedBookings = await Booking.find({owner: _id, status:"confirmed"})

        //Calculate monthly Revinue  from confirmed bookings
        const monthlyRevenue = booking.slice().filter(booking => booking.status === 'confirmed').reduce(( acc , booking)=> acc + booking.price, 0 )

        const DashboardData = {
            totalCars : cars.length,
            totalBookings : booking.length,
            pendingBookings : pendingBookings.length,
            completedBookings : completedBookings.length,
            recentBookings : booking.slice(0,3),
            monthlyRevenue 
        }

        res.json({ success: true , DashboardData})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

//Api to update user image

export const updateUserImage = async (req , res)=>{
    try {
        const {_id} = req.user;

        const imageFiles = req.file;

        //uplode image kit
        const fileBuffer = fs.readFileSync(imageFiles.path);
        const response = await imagekit.upload({
                file:fileBuffer,
                fileName: imageFiles.originalname,
                folder: '/cars',
        })

        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: "1280"} ,
                {quality: "auto"}, //Auto compression
                {format: "webp"} // Convert to modern format
        ]
    });

    const image = optimizedImageUrl;

    await User.findByIdAndUpdate(_id, {image})

    res.json({success: true , message: "Image Updated"})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}