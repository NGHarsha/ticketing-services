import { Ticket } from "../Ticket";

it("implements optimistic concurrency control", async () => {
  // create a ticket and save it to db
  const ticket = new Ticket({
    title: "concert",
    price: 5,
    userId: "123",
  });
  await ticket.save();

  //fetch ticket twice.(simulating multiple instances of prod)
  const instance_1 = await Ticket.findById(ticket.id);
  const instance_2 = await Ticket.findById(ticket.id);

  //make changes to two instances
  instance_1!.set({ price: 10 });
  instance_2!.set({ price: 15 });

  //save first one
  await instance_1!.save();

  try {
    //save second one(it should fail. since document will be updated to version 1 by 21st line)
    //this line tries to save a document with version 0, but db has no document with version 0
    // it got updated to version 1 by 21st line
    await instance_2!.save();
  } catch (err) {
    return;
  }
  //if instance2 gets saved(it should not get saved actually), we throw error
  throw new Error("Should not reach this point");
});

it("increments version number on saves", async () => {
  const ticket = new Ticket({
    title: "concert",
    price: 5,
    userId: "123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
