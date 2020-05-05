const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET, getUserId } = require('../utils');


const post = (parent, args, context) => {
  const userId = getUserId(context);
  return context.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: { connect: { id: userId } }
  });
};


const update = (parent, args) => {
  const link = links.find((link) => link.id === Number(args.id));
  const index = links.indexOf(link);
  const newLink = {
    ...link,
    url: args.url,
    description: args.description
  }
  links[index] = newLink;
  return links[index]
};

const deleteLink = (parent, args) => {
  const index = links.indexOf(links.find((link) => link.id !== Number(args.id)));
  links.splice(index, 1);
  return "Link successfully deleted"
}

const vote = async (parent, args, context) => {
  const userId = getUserId(context);

  // This is another function in the prisma context
  const voteExists = await context.prisma.$exists.vote({
    user: { id: userId },
    link: { id: args.linkId },
  });
  
  if (voteExists) {
    throw new Error(`Already voted for this link ${args.linkId}`)
  }

  return {
    user: { connect: { id: userId } },
    link: { connect: { id: args.linkId } }
  }
}

const signup = async (parent, args, context) => {
  const hashedPassword = await bcrypt.hash(args.password, 10);
  const { password, ...user } = await context.prisma.createUser({ ...args, password: hashedPassword });
  const token = jwt.sign({ userId: user.id }, APP_SECRET);
  return {
    user,
    token
  }
}

const login = async (parent, args, context) => {
  const { password, ...user } = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error("No such user exists");
  }

  const valid = bcrypt.compare(args.password, password);
  if (!valid) {
    throw new Error("Invalid Password");
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user
  }
}

module.exports = {
  post,
  update,
  deleteLink,
  vote,
  signup,
  login
}
