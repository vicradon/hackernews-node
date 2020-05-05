# Hackernews Node
A Hackernews clone built using graphql

## Basic Server
1. GraphQLServer
0. typedefs (optional)
0. resolvers
0. run server


## Schema-driven development
1. Extend the typeDef
2. Add the corresponding resolver function

## Prisma
Anytime a change is made to the datamodel.prisma, One has to run the prisma deploy command

It's kinda like
1. Make a change to the `datamodel.prisma` file
2. Add the changes to the `schema.graphql` file

First, we do the `prisma deploy`
Then do `prisma generate`

`prisma generate` generates the schema file for the prisma client

## Resolvers
Schemas are written in Schema Definition Language (SDL)
There're three root types:
* Query (for getting)
* Subscription (for listening to real-time stuff)
* Mutation (for altering or removing)

Each field from the schema (typedef) is represented as a function 
with the same name as that in the typeDef

Resolvers aren't for the root fields alone
They are for all the fields in the types of the
GraphQL Schema

## Datamodel.prisma
// @id is for creating global unique ids
// @createdAt would be managed by prisma and be readOnly


## Prisma in the cloud
We use context.prisma.[stuff] to access the data in the cloud db

The resolvers carry 
parent, args, context, info

Prisma client exposes a CRUD API for the models in your datamodel for you to read and write in your database

They are autogen based on definintons in datamodel.prisma

To attach the resolvers to the generated api methods, we use prisma-client-lib

When do we change stuff in both places
Like in the datamodel.prisma and the schema.graphql


## Advanced Mutations
signup and login are async mutations which require

## Potential Error
bcrypt.compare

## Auth
When sending requests as mutations, you'd recieve a response. Then collect the token and use it alongside a bearer in a http header

## Subscriptions
Sbscriptions return an `asyncIterator` rather than data
The resolvers are wrapped in an object alongside a property know as resolve

We make subscriptions for events that require them.
when a request is made for that event, our subscription resolver emits some data.

The subscription is kept active for a long time.

```graphql
subscription {
  link {
    id
    postedBy {
      name
      id
    }
  }
}
```

then the event

```graphql 
mutation {
  post(url:"a.url", description: "some description"){
    id
    postedBy {
      name
    }
  }
}
```
would cause a reaction in the subscription

Prisma exposes both CRUD methods and an `exits` method




## Fragments 
A fragment is a collection of fields on a specific type. They are used to enhance reusablity

Assuming we have a car type
```graphql
Car {
  name: String!
  age: Int!
  manufacturer: String!
  isOwned: Bool!
  ownerName: String
}
```
we could represent information that relates the owner into a fragment
```graphql
fragment ownerInfo on Car {
  isOwned
  ownerName
}
```
Now, when writing a query to get the owner information on a car, we do
```graphql
{
  allCars {
    ...ownerInfo
  }
}
```
instead of 
```graphql
{
  allCars {
    isOwned
    ownerName
  }
}
```

## Parametizing Fields with Arguments 


### Aliases
Aliases as we've seen in Gatsby is naming your queries to prevent errors in the server
```graphql
{
  first: User(id: "1") {
    name
  }
  second: User(id: "2") {
    name
  }
}
```
The codeblock above would produce
```json
{
  "first": {
    "name": "Alice"
  },
  "second": {
    "name": "Sarah"
  }
}
```

## Enums, Interfaces and Union types
### Enums
Enums are a special type of scalar. An example

enum worldOceans {
  ARTIC
  ATLANTIC
  INDIAN
  PACIFIC
  SOUTHERN
}

### Interfaces
Interfaces are used to describe a type in an abstract way

```graphql
interface SomeNode {
  id: ID!
  somename: String!
}

type Something implements SomeNode {
  id: ID!
  somename: String!
  somevalue: Int!
}
```
Any concrete type which implements this interface must have the specified fields in the interface

### Union types
consider this example
```graphql
type Soft {
  name: String!
  softness: Float!
}

type Hard {
  name: String!
  hardness: Float!
}

union Wood = Soft | Hard
```

Now, let's assume we've got to retrive info about a softwood, but only have a wood object to work wih, we do

```graphql
{
  allWood {
    name
    ...on Soft {
      softness
    }
    ...on Hard {
      hardness
    }
  }
}
```

## Introspection 
Can be used to ask for the types of a schema
GraphiQL is powered by introspection

## Security
Security in GraphQL involves:
* Preving server breakdown due to long queries
* Prevent infinitely looped queries (abusive queries)

`graphql-ruby` can be used to set a value for maximum query depth

### Query Complexity
Using complexity setting, we can set a custom complexity to esch query type

### Throttling
