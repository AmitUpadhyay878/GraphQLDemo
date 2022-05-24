import { quotes, users } from "./db.js";

import { randomBytes } from "crypto";

import mongoose from "mongoose";
// import bcrypt from "bcryptjs/dist/bcrypt";

import Bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SEC } from "./config.js";

const User = mongoose.model("User");
const Quote = mongoose.model("Quote");

const resolvers = {
  Query: {
    // users: () => users,
    users: async () => await User.find({}),

    // user: (_, { _id }) => users.find((user) => user._id == _id),
    user: async (_, { _id }) => await User.findOne({ _id: _id }),

    // iquote: async(_, { by }) => quotes.filter((quote) => quote.by == by),
    iquote: async (_ , { by }) => Quote.find({ by: by }),
    // quotes: () => quotes,
    quotes: async () => await Quote.find({}),
  },

  User: {
    // quotes: async(user) => quotes.filter((quote) => quote.by == user._id),
    quotes: async (user) =>
      await Quote.find({ by: user._id }).populate("by", "_id"),
  },

  Mutation: {
    signupUser: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });

      if (user) {
        throw new Error("User Already Exist Please Try With Another Email");
      }
      const hashedPassword = await Bcrypt.hash(userNew.password, 10);

      const newUser = new User({ ...userNew, password: hashedPassword });

      return await newUser.save();
    },

    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("Enter Valid user");
      }

      const doMatch = await Bcrypt.compare(userSignin.password, user.password);

      if (!doMatch) {
        throw new Error("Enter valid Credential");
      }

      const token = jwt.sign({ userId: user._id }, JWT_SEC);
      return { token };
    },

    // Quote Create by User When User LoggedIn (Protected Path)  --> its take 3 args 1-parent, 2-request, 3-context(destructred)
    createQuote: async (_, { name }, { userId }) => {
      if (!userId) throw new Error("You Must Be LogIn");

      const newQuotes = new Quote({
        name,
        by: userId,
      });

      await newQuotes.save();
      return "Quote Saved Successfully";
    },
  },
};

export default resolvers;
