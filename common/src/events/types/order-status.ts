export enum OrderStatus {
  //when order is created, but ticket it is trying to order has not been reserved
  Created = "created",
  //when the ticket the order has been trying to reserve is already reserved.
  //or when user cancelled
  //or order expires befor payment
  Cancelled = "cancelled",
  //when order has successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",
  //when order has reserved ticket and payment completed
  Complete = "complete",
}
