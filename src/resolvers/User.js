/**
 * The extra fields in the prisma schema prompted 
 * that we write extra resolvers for them
 */
const links = (parent, args, context) => {
  return context.prisma.user({ id: parent.id }).links();
}
module.exports = { links }

/** Technologies I know
 *
 * Gatsby || React
 * Flutter
 * GraphQL
 * Express
 */