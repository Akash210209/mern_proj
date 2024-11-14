// import Products from "../models/products.js";
// import mongoose from "mongoose";
// import cloudinary from 'cloudinary';
// import multer from 'multer';
// import path from 'path';


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
//   });

//   // Multer config (for local uploads)
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + path.extname(file.originalname));
//     }
//   });
//   const upload = multer({ storage });


  
// export const uploadProductImage = async (req, res) => {
//     try {
//       // Upload image to Cloudinary or store locally
//       if (req.file) {
//         const result = await cloudinary.v2.uploader.upload(req.file.path);
//         const imageUrl = result.secure_url;
  
//         const newProduct = new Product({
//           name: req.body.name,
//           price: req.body.price,
//           image: imageUrl  // Store Cloudinary URL in DB
//         });
  
//         await newProduct.save();
//         res.status(201).json(newProduct);
//       } else {
//         // Handle local image path saving
//         const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
//         const newProduct = new Product({
//           name: req.body.name,
//           price: req.body.price,
//           image: imageUrl
//         });
  
//         await newProduct.save();
//         res.status(201).json(newProduct);
//       }
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Error saving product");
//     }
//   };

//   export const createproduct = async (req, res) => {
//     const product = req.body;

//     if (!product.name || !product.price || !product.image) {
//         return res.status(400).json({
//             success: false,
//             message: "please provide all fields"
//         });
//     }

//     const newProduct = new Products(product)

//     try {
//         await newProduct.save();
//         res.status(201).json({
//             success: true,
//             data: newProduct
//         })
//     } catch (error) {
//         console.log(`error:${error?.message}`)
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         })
//     }

// }

// export const getallproducts = async (req, res) => {
//     try {
//         const allproducts = await Products.find({});
//         res.status(200).json({
//             success: true,
//             data: allproducts
//         })
//     } catch (error) {
//         res.status(404).json({
//             success: false,
//             message: "List Empty"
//         })
//     }
// }



// export const deleteproduct = async (req, res) => {
//     const {
//         id
//     } = req.params;
//     try {
//         await Products.findByIdAndDelete(id);
//         res.status(200).json({
//             success: true,
//             message: "Product Deleted"
//         })
//     } catch (error) {
//         res.status(404).json({
//             success: false,
//             message: "Product Not Found"
//         })
//         res.status(500).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }

// export const updateproduct = async (req, res) => {
//     const productdetails = req.body

//     const {
//         id
//     } = req.params;

//     if (!mongoose.Types.isValid(id)) {
//         res.status(404).json({
//             success: false,
//             message: "ID not found"
//         })
//     }
//     try {
//         const updatedproduct = await Products.findByIdAndUpdate(id, productdetails, {
//             new: true
//         });
//         res.status(200).json({
//             success: true,
//             data: updatedproduct
//         })
//     } catch (error) {
//         res.status(404).json({
//             success: false,
//             message: "Product Not Found"
//         })
//         res.status(500).json({
//             success: false,
//             message: "server error"
//         })
//     }
// }


import Products from "../models/products.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import multer from "multer";
import path from "path";
import dotenv from 'dotenv';

dotenv.config();



// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log(process.env.CLOUDINARY_API_KEY)
  // Multer storage configuration for local file storage (before uploading to Cloudinary)
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");  // Ensure the 'uploads/' folder exists
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid filename conflicts
    },
  });
  
  // Set up multer middleware for file handling
  const upload = multer({ storage });

  // Cloudinary upload function
  const uploadToCloudinary = (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: 'auto',
          public_id: fileName,
          folder: 'your-folder-name', // Optional: specify a folder in Cloudinary
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Error uploading to Cloudinary'));
          } else {
            resolve(result.secure_url); // Return the URL of the uploaded file
          }
        }
      );
  
      // Pipe the buffer into the stream
      stream.end(fileBuffer);
    });
  };
  
  
  // Product creation route with image upload to Cloudinary
  export const uploadProductImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
  
      // Upload the image buffer to Cloudinary
      const fileName = Date.now() + path.extname(req.file.originalname); // Generate a unique file name
      const imageUrl = await uploadToCloudinary(req.file.buffer, fileName); // Pass buffer to upload function
  
      // Create a new product
      const newProduct = new Products({
        name: req.body.name,
        price: req.body.price,
        image: imageUrl, // Store Cloudinary URL in DB
      });
  
      // Save the product to the database
      await newProduct.save();
  
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error uploading product:", error);
      res.status(500).json({ message: "Error creating product" });
    }
  };
  
  
  // Fallback create product route (if no image upload is required)
  export const createProduct = async (req, res) => {
    const { name, price, image } = req.body;
  
    if (!name || !price || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide all fields (name, price, image)",
      });
    }
  
    const newProduct = new Products({ name, price, image });
  
    try {
      await newProduct.save();
      res.status(201).json({
        success: true,
        data: newProduct,
      });
    } catch (error) {
      console.error(`Error: ${error?.message}`);
      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }};

export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Products.find({});
    res.status(200).json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "List is empty",
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Products.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product Deleted",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateProduct = async (req, res) => {
  const productDetails = req.body;
  const { id } = req.params;

  if (!mongoose.Types.isValid(id)) {
    return res.status(404).json({
      success: false,
      message: "ID not found",
    });
  }

  try {
    const updatedProduct = await Products.findByIdAndUpdate(id, productDetails, {
      new: true,
    });

    res.status(200).json({
      success: true,
      data: updatedProduct,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
