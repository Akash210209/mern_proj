import express from 'express';
import cors from 'cors'; // Import the CORS package
import { connectDB } from './config/db.js';
import productRoutes from './routes/product.route.js';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();  // This gets the current directory

const PORT = process.env.PORT || 5000;
const app = express();

if(process.env.NODE_ENV ==="production"){
    app.use(express.static(path.join(__dirname, "/frontend/build")))
    app.get("*",(req,res)=>{
      res.sendFile(path.resolve(__dirname, "frontend","build","index.html"))  
    })
}

// Enable CORS with the specific frontend URL
app.use(cors({
    origin: 'http://localhost:3000',  // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Optionally restrict the allowed methods
    allowedHeaders: ['Content-Type', 'Authorization']  // Optionally restrict the allowed headers
}));

app.use(express.json());

// Define your routes
app.use("/api/products", productRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Start the server
app.listen(PORT, () => {
    connectDB();
    console.log(`Server started on port ${PORT}`);
});


import multer from 'multer';
import cloudinary from 'cloudinary';



// Set up Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer config for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post('/api/products', upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
  
      // Generate a unique file name using a timestamp
      const fileName = Date.now() + path.extname(req.file.originalname);
  
      // Upload the file buffer to Cloudinary
      const imageUrl = await uploadToCloudinary(req.file.buffer, fileName);
  
      // Create a new product with the Cloudinary URL
      const newProduct = new Products({
        name: req.body.name,
        price: req.body.price,
        image: imageUrl,  // Store the Cloudinary URL in your DB
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json(newProduct);  // Return the saved product
    } catch (error) {
      console.error("Error uploading product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  });
  

