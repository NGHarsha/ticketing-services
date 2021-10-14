import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  status = 500;
  constructor(public reason: string) {
    super("Error connecting to db");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
