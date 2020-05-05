const feed = (parent, args, context, info) => {
  return context.prisma.links();
};

const link = (parent, args, context) => {
  return context.prisma.links().find((link) => link.id === args.id);
};

module.exports = {
  feed,
  link
}