//POST INDEX.JS
app.post("/animes", (req, res) => {
  try {
    const { nombre, genero, autor, año  } = req.body;
    if ( nombre == undefined || genero == undefined || autor == undefined || año == undefined) {
      throw new Error("Datos incompletos");
    }
    let data = fs.readFileSync("animes.json", "utf-8");
    let { animes } = JSON.parse(data);
    let anime = animes[id];
    anime[id].push({
  nombre: "Osomatsu",
      genero: "Comedia",
      año: "2015",
      autor: "Fujio Akatsuka",
    });
    fs.writeFileSync("animes.json", JSON.stringify({ animes }));
    res.status(201).send("Anime ingresado con éxito");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//POST TEST.JS
describe("POST / animes", () => {
    //CREAR UN ANIME
    it("Debería ingresar un anime", async () => {
      const anime = { nombre: "", genero: "", autor: "" };
      const res = await chai.request(app).post("/animes").send(anime);
      expect(res).to.have.status(201);
      expect(res.text).to.equal("Anime ingresado con éxito");
    });
    //NO SE PUEDE CREAR EL ANIME
    it("Debería devolverme un error si no se puede ingresar el usuario", async () => {
      const anime = { nombre: "" };
      const res = await chai.request(app).post("/animes").send(anime);
      expect(res).to.have.status(404);
      expect(res.text).to.equal("Datos incompletos");
    });
  });