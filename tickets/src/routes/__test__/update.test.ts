import request from "supertest";
import { app } from "../../app";

import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/Ticket";

it("returns 404 if ticket id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "some",
      price: 20,
    })
    .expect(404);
});

it("return 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "some",
      price: 20,
    })
    .expect(401);
});

it("returns 401 if user does not own the ticket", async () => {
  //ticket created by user1
  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "some",
      price: 20,
    });

  //user2 trying to update user1's ticket
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "something new",
      price: 1000,
    })
    .expect(401);
});

it("returns 400 if the user provide invalid title or price", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "some",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Something new",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket with valid inputs", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "some",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "something new",
      price: 100,
    })
    .expect(201);

  const ticket = await request(app).get(`/api/tickets/${res.body.id}`).send();

  expect(ticket.body.title).toEqual("something new");
  expect(ticket.body.price).toEqual(100);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "some",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "something new",
      price: 100,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("throws error if user tries to edit reserved ticket", async () => {
  const cookie = global.signin();

  const res = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "some",
      price: 20,
    });

  const createdTicket = await Ticket.findById(res.body.id);

  createdTicket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });

  createdTicket!.save();

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "something new",
      price: 100,
    })
    .expect(400);
});
