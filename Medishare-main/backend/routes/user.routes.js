import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  uploadMedicalReport,
} from "../controllers/user.controllers.js";
import {
  authMiddleware,
  verifyAdmin,
} from "../middlewares/auth.middlewares.js";
import {
  multerErrorHandler,
  upload,
} from "../middlewares/multer.middleware.js";
import { analyzePdfWithGemini } from "../lib/geminiConfig/gemini.config.js";
import { Donation } from "../models/donation.model.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.get("/profile", authMiddleware, getUserProfile); // Protected route

// Route to handle PDF upload and processing
router.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    console.log("File is now being sent to Gemini from routes");

    // Process the uploaded PDF
    const result = await analyzePdfWithGemini(req.file.path);

    // Send the analysis result
    res.json({ message: "Analysis complete", result });
  } catch (error) {
    console.error("Error during file upload and processing:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// donation model routes

// 1. Submit a Donation (User)
router.post("/donation/", authMiddleware, async (req, res) => {
  try {
    const { medicineName, batchNumber, quantity , manufacturerDetails} = req.body;

    // Check if all required fields are present
    if (!medicineName || !batchNumber || !quantity || !manufacturerDetails ) {  // TODO : || !image : this should be added later 
      return res
        .status(400)
        .json({ error: "All fields (medicineName, batchNumber, quantity, manufacturer details) are required" });
    }
    console.log("here in donation controller ")
    // Ensure quantity is a positive number
    if (isNaN(quantity) || quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number" });
    }

    const newDonation = new Donation({
      user: req.user.id,
      medicine : medicineName,
      batchNumber,
      quantity,
      manufacturerDetails,
    });

    await newDonation.save();
    res.status(201).json({
      message: "Donation submitted successfully!",
      donation: newDonation,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Admin approves/rejects a Donation
router.patch("/donation/:id", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    // Validate status field
    if (!status || !["approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status. Allowed values: 'approved', 'rejected'" });
    }

    const donation = await Donation.findById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    donation.status = status;
    donation.adminResponse = adminResponse || "";
    await donation.save();

    res.json({ message: `Donation ${status} successfully!`, donation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get all Donations (Admin)
router.get("/donation/", authMiddleware, verifyAdmin, async (req, res) => {
  try {
    console.log("doantion api to get all donations called ")
    const donations = await Donation.find().populate("user", "name email");
    console.log(donations)
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get User Donations (User)
router.get("/donation/user/:userId", authMiddleware, async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const userDonations = await Donation.find({ user: req.params.userId });
    res.json(userDonations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
