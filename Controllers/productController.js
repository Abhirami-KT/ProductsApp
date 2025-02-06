const mongoose = require('mongoose')
const products = require('../Models/productsSchema');

exports.addProductAPI = async (req, res) => {
    console.log("Inside Add product API");

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const { name, price } = req.body;
    const productImg = req.file.filename; // Get the filename from multer

    console.log("productImg", productImg);
    console.log("FormData", name, price);

    try {
        console.log("Inside Try");

        // Check if the product already exists
        const existingProduct = await products.findOne({ name });
        console.log("existingProduct", existingProduct);

        if (existingProduct) {
            return res.status(409).json({ message: "Product already exists.." });
        } else {
            // Create a new product with the image filename
            const newProduct = new products({
                name,
                price,
                image: productImg // Store the filename in the image field
            });

            // Save the product to the database
            await newProduct.save();
            res.status(200).json(newProduct); // Send back the newly created product
        }
    } catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ message: "Error adding product", error: err });
    }
};


exports.getProductsAPI = async (req, res) => {
    console.log("Inside get products API");

    try {
        const response = await products.find()
        console.log(response)
        res.status(200).json(response);
    }
    catch (err) {
        res.status(409).json(err)
    }
}

exports.getAProductAPI = async (req, res) => {
    console.log("Inside get A product API");

    const { id } = req.params;  // Extract the product ID from URL params
    console.log("Product ID:", id);

    try {
        const response = await products.findOne({ _id: id }); // Use `findOne` and `_id`
        if (!response) {
            return res.status(404).json({ message: "Product not found" });
        }
        console.log("Product Found:", response);
        res.status(200).json(response);
    }
    catch (err) {
        console.error("Error fetching product:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
};


exports.editProductsAPI = async (req, res) => {
    console.log("Inside edit products API");

    const { name, price } = req.body;
    const productImg = req.file ? req.file.filename : null;
    const productId = req.params.id; // Get the product ID from the request params

    console.log("Received Product ID:", productId);
    console.log("ProductImg:", productImg);
    console.log("FormData:", name, price);

    // Check if product ID is provided and is valid
    if (!productId) {
        return res.status(400).json({ message: "Product ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // Validate price
    if (price && isNaN(price)) {
        return res.status(400).json({ message: "Invalid price. It must be a number." });
    }

    try {
        // Find and update the product by ID
        const product = await products.findById(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product fields
        product.name = name || product.name;  // Only update if new value is provided
        product.price = price ? Number(price) : product.price;  // Convert price to number if it's valid
        if (productImg) {
            product.image = productImg;  // Update image if new image is provided
        }

        // Save the updated product
        await product.save();

        res.status(200).json({ message: "Product updated successfully", product });
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(500).json({ message: "Error updating product", error: err });
    }
};



exports.deleteProductAPI = async (req, res) => {
    const { id } = req.params; // Get product ID from URL parameters

    try {
        // Find and delete the product by ID
        const deletedProduct = await products.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully", deletedProduct });
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).json({ message: "Error deleting product", error: err });
    }
};
