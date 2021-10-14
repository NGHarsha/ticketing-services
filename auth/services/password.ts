import bcrypt from "bcryptjs";
export class Password {
  static compare(stored: string, supplied: string) {
    return bcrypt.compare(supplied, stored);
  }
}
