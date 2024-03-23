// Importa el enrutador de Express
const router = require("express").Router();
const Product = require("../models/Product.model");

// Define la ruta para agregar un nuevo producto
router.post("/addproduct", async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    console.log("Saved");
    res.json({ success: true, name: req.body.name });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, error: "Error adding product" });
  }
});

// Define la ruta para eliminar un producto
router.post("/removeproduct", async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({ success: true, name: product.name });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, error: "Error removing product" });
  }
});

// Exporta el enrutador para su uso en otras partes de la aplicación
module.exports = router;
