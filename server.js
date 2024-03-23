// server.js

// Importa la aplicación express
const app = require("./app");

// Define el puerto para el servidor
const PORT = process.env.PORT || 5005;

// Inicia el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
