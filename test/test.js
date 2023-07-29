const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { app } = require("../index");
const { describe } = require("node:test");
const expect = chai.expect;

//TEST
describe("API REST de Animes", () => {
  describe("GET / ", () => {
    //BIENVENIDO AL TEST
    it("Debería retornar mensaje de bienvenida", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.text).to.equal("Bienvenidos a nuestros test");
          done();
        });
    });
  });

  //GET
  describe("GET / animes", () => {
    //OK: ANIMES GENERAL
    it("Debería devolverme un array con los animes", async () => {
      const res = await chai.request(app).get(`/animes`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property("animes").that.is.a("object");
    });

    //OK: ANIME ESPECÍFICO
    it("Debería devolverme un anime en específico", async () => {
      const res = await chai.request(app).get(`/animes/1`);
      expect(res).to.have.status(200);
      expect(res.body).to.have.a("object");
      expect(res.body).to.have.property("nombre").equal("Akira");
    });

    //OK: ANIME NO ENCONTRADO
    it("Debería devolverme un anime no encontrado", async () => {
      const res = await chai.request(app).get(`/animes/idFalso`);
      expect(res).to.have.status(404);
      expect(res.text).to.be.equal("Anime no encontrado");
    });
  });

  //POST
  describe("POST / animes", () => {
    //OK: CREAR UN ANIME
    it("Debería ingresar un anime", async () => {
      const nuevoAnime = {
        nombre: "nombre",
        genero: "genero",
        autor: "autor",
        anio: "año",
      };
      const res = await chai.request(app).post("/animes").send(nuevoAnime);
      expect(res).to.have.status(201);
      expect(res.text).to.equal("Anime ingresado con éxito");
    });

    //OK: NO SE PUEDE CREAR EL ANIME
    it("Debería devolverme un error si no se puede ingresar el anime", async () => {
      const anime = { nombre: "" };
      const res = await chai.request(app).post("/animes").send(anime);
      expect(res).to.have.status(500);
      expect(res.text).to.equal("Datos incompletos");
    });
  });

  // PUT
  describe("PUT /animes/:id", () => {
    // ACTUALIZA EL ANIME
    it("Debería actualizar un anime si existe", async () => {
      const animeActualizado = {
        nombre: "Shirokuma Cafe",
        genero: "Josei",
        autor: "Aloha Higa",
        anio: "2013",
      };
      const res = await chai
        .request(app)
        .put("/animes/11")
        .send(animeActualizado);
      expect(res).to.have.status(202);
      expect(res.text).to.equal("Se ha modificado el anime");
    });

    // NO SE PUEDE ACTUALIZAR EL ANIME
    it("No debería actualizar un anime si no existe", async () => {
      const animeActualizado = {
        nombre: "",
        genero: "",
        autor: "",
        anio: "",
      };
      const res = await chai
        .request(app)
        .put("/animes/idFalso")
        .send(animeActualizado);
      expect(res).to.have.status(500);
      expect(res.text).to.equal("Anime no encontrado");
    });
  });

  describe("DELETE /animes/:id", () => {
    // SE ELIMINA UN ANIME SI EXISTE
    it("Debería eliminar un anime si existe", async () => {
      const res = await chai.request(app).delete(`/animes/12`); // Cambiar 'get' por 'delete'
      expect(res).to.have.status(200);
      expect(res.text).to.equal("Anime eliminado con éxito");
    });

    // NO SE PUEDE ELIMINAR EL ANIME
    it("No debería eliminar un anime si no existe", async () => {
      const res = await chai.request(app).delete(`/animes/999`);
      expect(res).to.have.status(500);
      expect(res.text).to.equal("Anime no encontrado");
    });
  });
});
