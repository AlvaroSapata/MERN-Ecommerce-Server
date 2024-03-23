// Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

// This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// Routes

// Importa y usa las diferentes rutas
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const cartRoutes = require("./routes/cart.routes");
app.use("/cart", cartRoutes);

const adminPanelRoutes = require("./routes/adminPanel.routes");
app.use("/admin", adminPanelRoutes);

const multerRoutes = require("./routes/multer.routes");
app.use("/multer", multerRoutes);

// Configuración de middleware para servir archivos estáticos
app.use("/images", express.static("upload/images"));

const productRoutes = require("./routes/product.routes");
app.use("/products", productRoutes);

// Importa y maneja los errores
require("./error-handling")(app);

module.exports = app;
