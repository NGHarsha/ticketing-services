import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  status = 400;
  constructor(public errors: ValidationError[]) {
    super("Error validaating request");

    //Once super is called, Javascript's Error class(in this case) breaks the
    //prototype chain and the object is no longer a instance of RequestValidation.
    //It will be the iinstance of Error. To retain the instance and prototype chain,
    //set the prototype.
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      return { message: error.msg, field: error.param };
    });
  }
}
