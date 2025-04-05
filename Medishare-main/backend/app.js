import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import userRoute from "./routes/user.routes.js";
import blockChainRoute from "./routes/blockchain.routes.js";
import { multerErrorHandler } from "./middlewares/multer.middleware.js";
import medicineRoute from "./routes/medicine.routes.js";
dotenv.config();

import { ethers } from 'ethers';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { abi } = require("./artifacts/contracts/Medishare.sol/Medishare.json");

const API_URL = "http://127.0.0.1:8545"; // Hardhat local node
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Create a provider with ENS disabled
const provider = new ethers.JsonRpcProvider(API_URL, {
  name: "localhost",
  chainId: 31337,
  ensAddress: null  // Set ENS to null to disable ENS resolution
});

// Create signer with the provider
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Create contract instance with signer
export const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// Add the error handler middleware after all routes
app.use(multerErrorHandler);
app.get("/", (req, res) => {
  res.send("Hello World");
});

// routes
app.use("/users", userRoute);
app.use("/chain", blockChainRoute);
app.use("/ecommerce", medicineRoute);

export default app;