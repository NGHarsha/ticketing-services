import { Publisher, OrderCreatedEvent, Subjects } from "@ticketingng/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}
