//* ------------------   Routes   ------------------ *//
const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model"); // Asegúrate de importar tu modelo de producto
// const { isAuthenticated } = require("../middleware/jwt.middleware");
// const { isAdmin } = require("../middleware/isAdmin.middleware");

//* GET /products/all - Ruta para obtener todos los productos
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      res.status(404).json({ message: "No hay productos." }); // Enviar un código de estado 404 para indicar que no se encontraron productos
    } else {
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//* GET "/products/:productId" - Ruta para obtener los detalles de un producto
router.get("/:productId", async (req, res, next) => {
  try {
    const producDetails = await Product.findById(req.params.productId);
    if (producDetails) {
      res.status(200).json({
        message: "Producto encontrado con éxito",
        product: producDetails,
      });
      console.log("Producto encontrado con éxito");
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
      console.log("Producto no encontrado");
    }
  } catch (error) {
    res.status(404).json({ message: "Error al buscar producto" });
    console.log("Error al buscar producto");
  }
});

//* POST /products/add - Ruta para registrar un nuevo producto
router.post("/add", /* isAuthenticated, */ /* isAdmin, */ async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({
      success: true, // Agregar esta propiedad
      message: "Producto registrado con éxito",
      product: savedProduct,
    });
    console.log("Producto creado con éxito");
  } catch (error) {
    res.status(500).json({
      success: false, // Agregar esta propiedad
      message: "Error al registrar el producto",
      error: error.message,
    });
    console.log("Error al registrar el producto");
  }
});


//* PUT /products/edit/:productId - Ruta para editar un producto existente por su ID
router.put(
  "/edit/:productId",
  /* isAuthenticated, */
  /* isAdmin, */ async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productId,
        req.body,
        { new: true }
      );
      if (updatedProduct) {
        res.status(200).json({
          message: "Producto editado con éxito",
          product: updatedProduct,
        });
        console.log("Producto editado con éxito");
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
        console.log("Producto no encontrado");
      }
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al editar el producto", error: error.message });
      console.log("Error al editar el producto");
    }
  }
);

//* DELETE /products/delete/:productId - Ruta para borrar un producto por su ID
router.delete(
  "/delete/:productId",
  /* isAuthenticated, */
  /* isAdmin, */
  async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(
        req.params.productId
      );
      if (deletedProduct) {
        res.status(204).json({ message: "Producto eliminado con éxito" });
        console.log("Producto eliminado con éxito");
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
        console.log("Producto no encontrado");
      }
    } catch (error) {
      res.status(500).json({
        message: "Error al eliminar el producto",
        error: error.message,
      });
      console.log("Error al eliminar el producto");
    }
  }
);

//* GET /products/newcollections - Get the New Collections products from the database
router.get("/newcollections", async (req, res) => {
  try {
    let products = await Product.find({});
    let arr = products.slice(1).slice(-8);
    console.log("New Collections");
    res.send(arr);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//* GET /products/popularinwomen - Get the Popular in women products from the database
router.get("/popularinwomen", async (req, res) => {
  try {
    let products = await Product.find({});
    let arr = products.splice(0, 4);
    console.log("Popular In Women");
    res.send(arr);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
