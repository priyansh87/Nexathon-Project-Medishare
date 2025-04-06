import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    medicines: [
      {
        medicine: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
        quantity: { type: Number, required: true },
      },
    ],
  });
  
export const Cart = mongoose.model("Cart", cartSchema);
  