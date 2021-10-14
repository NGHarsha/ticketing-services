import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@ticketingng/common";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../models/Ticket";
import { Order } from "../models/Order";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be specified"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    //console.log(ticketId);
    //Check if ticket exists. If it doesnt exist throw error.
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    //Check if it is reserved.(i.e Some other user is buying it)
    const existingOrder = await Order.findOne({ ticket: ticketId });
    let isReserved = false;
    if (existingOrder) {
      console.log("EXISTINGORDER: ", existingOrder);
      if (
        existingOrder.status === OrderStatus.Complete ||
        existingOrder.status === OrderStatus.AwaitingPayment ||
        existingOrder.status === OrderStatus.Cancelled
      ) {
        console.log("Changed isReserved to true");
        isReserved = true;
      }
    }

    //    const isReserved = await ticket.isReserved();

    console.log("TICKET RESERVED STATUS IS: " + isReserved);
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved");
    }

    //Calculate expiration time for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    //Build order and save to db
    const order = new Order({
      userId: req.currentUser.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRoute };
