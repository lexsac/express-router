process.env.NODE_ENV = "test";
const request = require("supertest");

const app = require("../app");
let items = require("../fakeDb");


let doritos = { "name": "Doritos", "price": 5.99 };

beforeEach(function () {
  items.push(doritos);
});

afterEach(function () {
  // make sure this *mutates*, not redefines, `items`
  items.length = 0;
});

describe("GET /items", () => {
  test("Get all items", async () => {
    const res = await request(app).get("/items");
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [doritos] })
  })
})

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${doritos.name}`);
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: doritos })
  })
  test("Responds with 404 for invalid item", async () => {
    const res = await request(app).get(`/items/watermelon`);
    expect(res.statusCode).toBe(404)
  })
})

describe("POST /items", () => {
  test("Creating an item", async () => {
    const res = await request(app).post("/items").send({ "name": "Cheetos", "price": 3.99 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ item: { "name": "Cheetos", "price": 3.99 } });
  })
  test("Responds with 400 if name is missing", async () => {
    const res = await request(app).post("/items").send({});
    expect(res.statusCode).toBe(400);
  })
})

describe("/PATCH /items/:name", () => {
  test("Updating an item's name", async () => {
    const res = await request(app).patch(`/items/${doritos.name}`).send({ "name": "Chips" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ item: { name: "Chips" } });
  })
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/Dorrrritos`).send({ "name": "Chips" });
    expect(res.statusCode).toBe(404);
  })
})

describe("/DELETE /items/:name", () => {
  test("Deleting an item", async () => {
    const res = await request(app).delete(`/items/${doritos.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Deleted' })
  })
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/candy`);
    expect(res.statusCode).toBe(404);
  })
})

