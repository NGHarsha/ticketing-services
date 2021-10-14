import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketingng/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
