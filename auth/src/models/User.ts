import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// interface UserAttrs {
//   email: string;
//   password: string;
// }

interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// interface UserModel extends mongoose.Model<UserDoc> {
//   build(attrs: UserAttrs): UserDoc;
// }

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  //Transform normal mongo output object to required/generalized JSON form
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

// userSchema.statics.build = (attrs: UserAttrs) => {
//   return new User(attrs);
// };

//inside the pre-save hook this refers to the document that has to be stored.
//If arrow function is used in this case, 'this' will be overridden by the context of this file.
//Hence use legacy function only!!!!!!!!
userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hpwd = await bcrypt.hash(this.get("password"), 12);
    this.set("password", hpwd);
  }
  done();
});

const User = mongoose.model<UserDoc>("User", userSchema);

export { User };
