const { ApolloServer, gql } = require('apollo-server');
const mongoose = require("mongoose");
const { model, Schema } = mongoose
// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const testSchema = new Schema({
  name: {
    type: String,
    required: true
  },
});

const TestSchema = model("Test", testSchema);
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  type Test {
    name: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    test: [Test]
  }

  type Mutation {
    make(name: String!): Test
  }
`;

const books = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];
// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    test: () => TestSchema.find()
  },
  Mutation: {
    make: (root, {name}) => {
      console.warn(name, "NAME")
      new TestSchema({ name: name }).save()
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true}).then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  });

  var test = new TestSchema({ name: 'fluffy' });

  test.save()

})