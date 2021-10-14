import { OrderStatus } from "@ticketingng/common";
import request from "supertest";

import { app } from "../../app";
import { Ticket } from "../../models/Ticket";
import { natsWrapper } from "../../nats-wrapper";

it("updates a order to cancelled state", async () => {
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

  expect(order.status).toEqual(OrderStatus.Created);

  const res = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);
});

it("publishes a cancelled event", async () => {
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

  expect(order.status).toEqual(OrderStatus.Created);

  const res = await request(app)
    .patch(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
