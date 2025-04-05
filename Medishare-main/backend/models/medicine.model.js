import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    expirationDate: { type: Date }, // required true later 
    donatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tracking donor
    
});
  
export const Medicine = mongoose.model("Medicine", medicineSchema);
  