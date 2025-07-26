import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const BookingSchema = new Schema({
   car:{type: ObjectId, ref:"Car", required: true},
   user:{type: ObjectId, ref: 'User', required: true },
   owner:{type: ObjectId, ref: 'User', required: true },
   pickupDate:{type: Date, required: true },
   returnDate:{type: Date, required: true },
   status:{type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending'},
   price:{type: Number, required: true },
   pricePerDay: {type: Number,required: true
}
}, { timestamps: true });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;
