import {
  Publisher,
  ExpirationCompleteEvent,
  Subjects,
} from "@ticketingng/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
