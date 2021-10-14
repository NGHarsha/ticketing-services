import { app } from "../../app";
import request from "supertest";
import mongoose from "mongoose";
import { Order } from "../../models/order";
import { OrderStatus } from "@ticketingng/common";

//this import will be mocked if jest.mock line is enabled below. else stripe sdk will be used
import { stripe } from "../../stripe";

// this is required if stripe provided test environment is not being used
// jest.mock("../../stripe");

it("returns a 404 when purchasing a order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asacas",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing a order that does not belong to the user", async () => {
  const order = new Order({
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    _id: new mongoose.Types.ObjectId().toHexString(),
    price: 211,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asacas",
      orderId: order.id,
    })
    .expect(401);
});

it("returns a 404 when purchasing a cancelled order", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cookie = global.signin(userId);
  const order = new Order({
    userId: userId,
    status: OrderStatus.Cancelled,
    _id: new mongoose.Types.ObjectId().toHexString(),
    price: 211,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", cookie)
    .send({
      token: "aacas",
      orderId: order.id,
    })
    .expect(400);
});

// it("returns a 201 with valid inputs", async () => {
//   const userId = new mongoose.Types.ObjectId().toHexString();
//   const cookie = global.signin(userId);
//   const order = new Order({
//     userId: userId,
//     status: OrderStatus.Created,
//     _id: new mongoose.Types.ObjectId().toHexString(),
//     price: 211,
//     version: 0,
//   });
//   await order.save();

//   await request(app)
//     .post("/api/payments")
//     .set("Cookie", cookie)
//     .send({
//       token: "tok_visa",
//       orderId: order.id,
//     })
//     .expect(201);

//   const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//   expect(chargeOptions.source).toEqual("tok_visa");
//   expect(chargeOptions.amount).toEqual(211 * 100);
//   expect(chargeOptions.currency).toEqual("inr");
// });
