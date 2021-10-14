import { TicketUpdatedEvent } from "@ticketingng/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/Ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  //create instance of TicketUpdatedListener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //Create and save a ticket
  const ticket = new Ticket({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  //create fake data event
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    title: "new concert",
    price: 299,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  //create fake message object
  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, ticket, msg };
};

it("finds,updates and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();

  //call onMessage function of TicketUpdatedListener
  await listener.onMessage(data, msg);

  //write assertions to make sure that ticket has been created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks(acknowledges) the message", async () => {
  const { listener, data, ticket, msg } = await setup();

  //call onMessage function of TicketUpdatedListener
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call acks, if the version != last_version+1", async () => {
  const { data, ticket, msg, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
