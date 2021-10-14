import { TicketCreatedEvent } from "@ticketingng/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  //create instance of ticketcreatedlistener
  const listener = new TicketCreatedListener(natsWrapper.client);

  //create fake data event
  const data: TicketCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  //call onMessage function of TicketCreatedListener
  await listener.onMessage(data, msg);

  //write assertions to make sure that ticket has been created
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acks(acknowledges) the message", async () => {
  const { listener, data, msg } = await setup();

  //call onMessage function of TicketCreatedListener
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
