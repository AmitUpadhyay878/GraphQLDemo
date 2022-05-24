import { gql } from "apollo-server";
// gql is use to create a schema

const typeDefs = gql`
  type Query {
    users: [User]
    user(_id: ID!): User
    quotes: [QuoteWithName]
    iquote(by: ID!): [Quotes]
  }

  type QuoteWithName{
    name: String!
    by: IdName
  }

  type IdName {
    _id: String
    firstname: String   
  }

  type User {
    _id: ID
    firstname: String
    lastname: String
    email: String
    password: String
    quotes: [Quotes]
  }

  type Quotes {
    name: String
    by: ID
  }

  type Token {
    token: String
  }

  type Mutation {
    signupUser(userNew: UserInput!): User
    signinUser(userSignin: UserSigninInput!): Token
    createQuote(name: String!): String
  }

  input UserInput {
    firstname: String!
    lastname: String!
    email: String!
    password: String!
  }
  input UserSigninInput {
    email: String!
    password: String!
  }
`;
export default typeDefs;
