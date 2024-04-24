const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configuración de Multer para almacenar imágenes
const storage = multer.diskStorage({
    destination: "./upload/images",
    filename: (req, file, cb) => {
        cb(
            null,
            `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

const upload = multer({ storage: storage });

// Ruta para subir imágenes
router.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        success: 1,
        image_url: `https://lagrima-server.adaptable.app/images/${req.file.filename}`,
    });
});

module.exports = router;
