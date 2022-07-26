import mongoose from "mongoose";
const schema = mongoose.Schema;

const postSchema = new mongoose.Schema({
  title: String,
  description: String,
  created_on: { type: Date, default: Date.now },
});

const user = new schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  created_on: { type: Date, default: Date.now },
});

export const PostsModel = mongoose.model("posts", postSchema);
export const UsersModel = mongoose.model("Users", user);

// module.exports = { PostsModel, UsersModel };
