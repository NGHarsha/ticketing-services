import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/Order";
import { Ticket } from "../../models/Ticket";

const buildTicket = async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for a particular user", async () => {
  const ticket_1 = await buildTicket();
  const ticket_2 = await buildTicket();
  const ticket_3 = await buildTicket();

  const user_1 = global.signin();
  const user_2 = global.signin();

  await request(app)
    .post("/api/orders")
    .set("Cookie", user_1)
    .send({ ticketId: ticket_1.id })
    .expect(201);

  const { body: order_1 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user_2)
    .send({ ticketId: ticket_2.id })
    .expect(201);

  const { body: order_2 } = await request(app)
    .post("/api/orders")
    .set("Cookie", user_2)
    .send({ ticketId: ticket_3.id })
    .expect(201);

  const res = await request(app)
    .get("/api/orders")
    .set("Cookie", user_2)
    .expect(200);

  expect(res.body.length).toEqual(2);
  expect(res.body[0].id).toEqual(order_1.id);
  expect(res.body[1].id).toEqual(order_2.id);
});
