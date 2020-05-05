const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('./generated/prisma-client');
const Link = require('./resolvers/Link')
const Mutation = require('./resolvers/Mutation')
const Query = require('./resolvers/Query')
const User = require('./resolvers/User')
const Subscription = require('./resolvers/Subscription')
const Vote = require('./resolvers/Vote')

const resolvers = {
  Link,
  Mutation,
  Query,
  User,
  Subscription,
  Vote
}

// Server is an instance of GraphQLServer
// We are attaching the prisma client instance when the server is 
// being instantiated. We can access context.prisma in our resolvers


// Converting the context to a function ensures that
// Authorization can be carried out from the request object
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      ...request,
      prisma
    }
  }
});

server.start(() => console.log('server is running at http://localhost:4000'));