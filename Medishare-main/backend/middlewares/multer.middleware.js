import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Define the folder path where you want to save uploaded files
const uploadPath = path.join('C:', 'Users', 'Priyansh', 'OneDrive', 'Desktop', 'project-bolt-sb1-1yf26gpm (2)HACKATHONPROJECT', 'backend', 'public');

// Ensure the folder exists (create it if it doesn't exist)
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer configuration - Using diskStorage to store the file on disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the destination folder
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Set the file name (e.g., adding timestamp to ensure uniqueness)
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const newFileName = `report${fileExtension}`;
    cb(null, newFileName); // Store with new file name
  }
});

// Define file filter to restrict uploads to PDFs only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type. Only PDF files are allowed.'));
  }
  cb(null, true); // Accept the file
};

// Set file size limit to 10MB
const limits = {
  fileSize: 10 * 1024 * 1024, // 10 MB max file size
};

// Initialize multer with disk storage, file filter, and size limits
const upload = multer({ storage, fileFilter, limits });

// Error handling for multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors (e.g., file too large)
    return res.status(400).json({ error: `Multer error: ${err.message}` });
  }
  if (err) {
    // Handle any other errors (e.g., invalid file type)
    return res.status(400).json({ error: err.message });
  }
  next(); // If no error, continue to next middleware
};

export { upload, multerErrorHandler };
