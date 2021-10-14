import { PaymentCreatedEvent, Publisher, Subjects } from "@ticketingng/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
