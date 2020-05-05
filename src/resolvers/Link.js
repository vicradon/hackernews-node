/**
 * For each user defined type, 
 * a new resolver function would have to be written
 */

const postedBy = (parent, args, context) => {
  return context.prisma.link({ id: parent.id }).postedBy()
}

const votes = (parent, args, context) => {
  return context.prisma.link({ id: parent.id }).votes()
}

module.exports = {
  postedBy,
  votes
}