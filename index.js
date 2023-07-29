const express = require("express");
const app = express();
const fs = require("fs");
const PORT = 3380;

//MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function leerData() {
  try {
    let data = fs.readFileSync("animes.json", "utf-8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error al leer el archivo");
  }
}

async function escribirData(data) {
  try {
    fs.writeFileSync("animes.json", JSON.stringify(data), "utf-8");
  } catch (error) {
    throw new Error("Error al escribir en el archivo");
  }
}

//STATUS INICIAL
app.get("/", (req, res) => {
  res.status(200).send("Bienvenidos a nuestros test");
});

//GET: ANIMES
app.get("/animes", async (req, res) => {
  try {
    const data = await leerData();
    res.status(200).json(data);
  } catch (error) {
    res.status(404).json(data);
  }
});

//GET: ANIMES POR ID
app.get("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerData();
    const anime = data.animes[id];
    if (!anime) {
      throw new Error("Anime no encontrado");
    }
    res.status(200).send(anime);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

//POST
app.post("/animes", async (req, res) => {
  try {
    const { nombre, genero, autor, anio } = req.body;
    if (!nombre || !genero || !autor || !anio) {
      console.log(req.body);
      throw new Error("Datos incompletos");
    }
    const data = await leerData();
    const nuevoId = Object.keys(data.animes).length + 1;
    const nuevoAnime = {
      nombre,
      genero,
      año: anio,
      autor,
    };
    data.animes[nuevoId.toString()] = nuevoAnime;
    escribirData(data);
    res.status(201).send("Anime ingresado con éxito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//PUT
app.put("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerData();
    if (Object.hasOwn(data.animes, id)) {
      const animeActualizado = req.body;
      data.animes[id] = animeActualizado;
      escribirData(data);
      res.status(202).send("Se ha modificado el anime");
    }
    throw new Error("Anime no encontrado");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//DELETE
app.delete("/animes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await leerData();
    if (Object.hasOwn(data.animes, id)) {
      delete data.animes[id];
      console.log(data)
      escribirData(data);
      res.status(200).send("Anime eliminado con éxito");
    }
    throw new Error("Anime no encontrado");
  } catch (error) {
    res.status(500).send("Anime no encontrado");
  }
});

//PORT
app.listen(PORT, () => console.log(`Escuchando en el puerto ${PORT}`));

//EXPORT
module.exports = { app };
