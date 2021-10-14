import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns ticket if ticket is not found", async () => {
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "concert",
      price: 15,
    })
    .expect(201);

  const ticket = await request(app)
    .get(`/api/tickets/${res.body.id}`)
    .send()
    .expect(200);

  expect(ticket.body.title).toEqual("concert");
  expect(ticket.body.price).toEqual(15);
});
