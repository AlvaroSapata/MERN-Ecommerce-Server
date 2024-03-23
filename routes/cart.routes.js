const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.json("Checking Lagrima cart route");
});

//* GET /cart/userCart - devuelve todos los productos del carrito
router.get("/userCart", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;

  try {
    const response = await User.findById(userId).populate(
      "cart.productId",
      "_id name image price"
    );

    if (response.cart.length === 0) {
      // El carrito está vacío, devuelve un mensaje
      res.json({ message: "Tu carrito está vacío" });
    } else {
      // El carrito contiene productos, devuélvelos
      let totalPrice = 0;
      let quantity = 0;
      response.cart.forEach((product) => {
        console.log(product);
        totalPrice += product.productId.price * product.quantity;
        quantity += product.quantity
      });
      res.json({
        cart: response.cart,
        totalPrice: totalPrice,
        quantity: quantity,
      });
    }
  } catch (err) {
    next(err);
  }
});

//* PATCH /cart/:productId/add - añade un producto a la compra en el array del carrito del usuario
router.patch("/:productId/add", isAuthenticated, async (req, res, next) => {
  const idUser = req.payload._id; // id del usuario cogido del token
  if (!idUser) {
    res.json(null);
  }
  const { productId } = req.params; //id del producto a añadir
  let updatedUser = null;
  try {
    const foundUser = await User.findOne({
      $and: [{ _id: idUser }, { "cart.productId": productId }],
    });

    if (!foundUser) {
      // si no existe ese producto en el carrito del usuario

      updatedUser = await User.findByIdAndUpdate(
        idUser,
        {
          $push: { cart: { productId } }, //añade un producto al array de carrito
        },
        { new: true }
      ).populate("cart.productId", "_id name image price");
    } else {
      updatedUser = await User.findOneAndUpdate(
        // para encontrar el elemento a actualizar y el indice del carrito
        { $and: [{ _id: idUser }, { "cart.productId": productId }] },
        { $inc: { "cart.$.quantity": 1 } }, // el $ es usado para saber cual es el indice a actualizar
        // incrementa en uno la cantidad de ese produccto
        { new: true }
      )
        .populate("cart.productId", "_id name image price")
        .select({ cart: 1 });
    }

    const productFound = updatedUser.cart.find((eachProduct) => {
      return eachProduct.productId._id.toString() === productId;
    });
    res.json(productFound);
  } catch (err) {
    next(err);
  }
});

//* PATCH /cart/:productId/pull - disminute cantidad del producto del array del carrito del usuario y si es 0 lo elimina
router.patch("/:productId/pull", isAuthenticated, async (req, res, next) => {
  const idUser = req.payload._id;
  const { productId } = req.params;
  let updatedUser = null;

  try {
    const foundUser = await User.findOne(
      {
        $and: [{ _id: idUser }, { "cart.productId": productId }],
      },
      { "cart.$": 1 }
    );

    if (!foundUser) {
      return res
        .status(404)
        .json({ error: "Usuario o producto no encontrado" });
    }

    if (foundUser.cart[0].quantity > 1) {
      updatedUser = await User.findOneAndUpdate(
        { $and: [{ _id: idUser }, { "cart.productId": productId }] },
        { $inc: { "cart.$.quantity": -1 } },
        { new: true }
      )
        .populate("cart.productId", "_id name image price")
        .select({ cart: 1 });
    } else {
      updatedUser = await User.findByIdAndUpdate(
        idUser,
        {
          $pull: { cart: { productId: productId } },
        },
        { new: true }
      )
        .populate("cart.productId", "_id name image price")
        .select({ cart: 1 });
    }

    if (!updatedUser) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const productFound = updatedUser.cart.find((eachProduct) => {
      return eachProduct.productId._id.toString() === productId;
    });

    if (!productFound) {
      return res
        .status(404)
        .json({ error: "Producto no encontrado en el carrito del usuario" });
    }

    res.json(productFound);
  } catch (err) {
    // Manejo de errores generales
    next(err);
  }
});

//* PUT /cart/deleteall - vacía carrito
router.put("/deleteall", isAuthenticated, async (req, res, next) => {
  const idUser = req.payload._id;

  try {
    const user = await User.findById(idUser);

    if (user.cart.length === 0) {
      res.json({ message: "El carrito ya está vacío" });
    } else {
      await User.findByIdAndUpdate(idUser, { cart: [] }); // Vacía el carrito del usuario
      res.json({ message: "Carrito vaciado con éxito" });
    }
  } catch (err) {
    // Manejo de errores
    console.error(err);
    res.status(500).json({ error: "No se pudo vaciar el carrito" });
  }
});

//* GET  /cart/total - devuelve la cantidad total del carrito
/* router.get("/total", isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  console.log(req.payload);

  try {
    const response = await User.findById(userId).populate(
      "cart.productId",
      "_id name image price"
    );

    if (response.cart.length === 0) {
      // Si el carrito está vacío, devuelve un mensaje
      res.json({ message: "El carrito está vacío" });
    } else {
      const total = response.cart.reduce((accumulator, eachProduct) => {
        return accumulator + eachProduct.quantity * eachProduct.productId.price;
      }, 0);

      res.json(total); // Retorna el total del carrito de ese usuario
    }
  } catch (err) {
    next(err);
  }
}); */

module.exports = router;
