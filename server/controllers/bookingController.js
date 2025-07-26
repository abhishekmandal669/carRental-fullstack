


//Function  to check availability of a car

import Booking from "../models/Booking.js";
import Car from "../models/Car.js";

const checkAvailability = async (carId, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        car: carId,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate } 
    });
    return bookings.length === 0;
}


//Api to check car availability for given date on first page 

export const checkCarAvailability = async (req, res) => {
    try {
        const {location , pickupDate, returnDate} = req.body;

        //fetch all available cars based on location and date
        const cars = await Car.find({
            location,
            isAvailable: true,
        });

        //check car availablity using promess
        const availableCarPromises = cars.map(async (car) => {
            const isAvailable=  await checkAvailability(car._id, pickupDate, returnDate);
            return {...car._doc, isAvailable: isAvailable};
        })

        let availableCars = await Promise.all(availableCarPromises);
        availableCars = availableCars.filter(car => car.isAvailable);
        
        res.json({ success: true, cars: availableCars });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

//Api to create a booking

export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res.json({ success: false, message: 'Car is not available for the selected dates' });
    }

    const carData = await Car.findById(car);
    if (!carData) {
      return res.json({ success: false, message: 'Car not found' });
    }

    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));

    if (noOfDays <= 0) {
      return res.json({ success: false, message: 'Return date must be after pickup date' });
    }

    const price = carData.pricePerDay * noOfDays;

    await Booking.create({
      car,
      user: _id,
      owner: carData.owner,
      pickupDate,
      returnDate,
      price,
      pricePerDay: carData.pricePerDay,
    });

    res.json({ success: true, message: 'Booking created successfully' });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


//Api to list user bookings

export const getUserBookings = async (req, res) => {
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate('car').sort({ createdAt: -1 });

        res.json({ success: true, bookings });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

//Api to get owner booking 

export const getOwnerBookings = async (req, res) => {
    try {
        if(req.user.role !== 'owner') {
            return res.json({ success: false, message: 'You are not authorized to view this' });
        }
        const bookings = await Booking.find({ owner: req.user._id }).populate('car user').select("-user.password").sort({ createdAt: -1 });

        res.json({ success: true, bookings });
       
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}

//Api to update booking status

export const changeBookingStatus = async (req, res) => {
    try {
        const {_id} = req.user;
        const {bookingId , status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !==_id.toString()){
            return res.json({success: false, message: 'You are not authorized'})
        }

        booking.status = status;
        await booking.save();

        res.json({success: true , message:"Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
        
    }
}