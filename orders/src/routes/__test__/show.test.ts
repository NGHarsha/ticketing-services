import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/Ticket";

it("fetches a single order", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  const { body: fetched } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(200);

  expect(fetched.id).toEqual(order.id);
});

it("it throws error if user is not the same one who created order", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const user_1 = global.signin();
  const user_2 = global.signin();

  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user_1)
    .send({ ticketId: ticket.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user_2)
    .expect(401);
});
