const { ApolloServer, gql } = require("apollo-server");

const books = [
  {
    id: "1",
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    id: "2",
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const comments = [
  {
    bookId: "1",
    comment: "AAAAAA",
    isGood: true,
  },
  {
    bookId: "1",
    comment: "BBBBBB",
    isGood: false,
  },
  {
    bookId: "2",
    comment: "CCCCCC",
    isGood: true,
  },
];
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.

  input BookInput {
    title: String!
    author: String!
  }
  type Comment {
    bookId: ID
    comment: String
  }

  type Book {
    id: ID
    title: String
    author: String
    comments(isGood: Boolean): [Comment]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    getById(id: ID!): Book
  }
  type Mutation {
    createBook(input: BookInput): Book
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => {
      console.log("call books query");
      return books;
    },
    getById: (_, { id }) => books.find((book) => book.id === id),
  },
  Mutation: {
    createBook: (_, { input }) => {
      console.log(input);
      const id = books.length + 1;
      books.push({ ...input, id });

      return books[books.length - 1];
    },
  },
  Book: {
    comments: (book, { isGood = true }) => {
      console.log("call list comments of book", book);

      return comments.filter(
        (comment) => comment.bookId === book.id && comment.isGood === isGood
      );
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
