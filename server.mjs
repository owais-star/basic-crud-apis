import express, { response } from "express";
import { PostsModel } from "./models/postMoodel.mjs";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors"
const PORT = process.env.PORT || 5000
import mongoose from "mongoose";

const app = express();
const upload = multer();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5001", "http://192.168.0.107:3000", "https://nextjs-demo-app-umber.vercel.app"],
  credentials: true
}))
app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);

mongoose.connect("mongodb+srv://owais:dev@userdata.588jr.mongodb.net/nextJs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  console.log("headers", req.headers);
  console.log(req.connection.remoteAddress);
  res.status(200).send("hello world");
});

app.get("/api/getposts", (req, res) => {
  try {
    const { title } = req.headers;
    const query = {};
    if (title) {
      query.title = title;
    }
    PostsModel.find(query, (error, data) => {
      if (error) {
        throw error;
      } else {
        res.status(200).send({ status: true, code: "200", data });
      }
    });
  } catch (error) {
    res.status(400).send(`got an error during get post ${error.message}`);
  }
});

app.post("/api/addpost", (req, res) => {
  try {
    const postData = req.body;
    console.log(postData);
    PostsModel.create(postData, (error, data) => {
      if (error) {
        throw error;
      } else {
        console.log(data);
        res.status(200).send({
          status: true,
          code: 200,
          message: "Created post succesfully",
        });
      }
    });
  } catch (error) {
    res.status(400).send(`got an error`, error.message);
  }
});

app.put("/api/updatepost", (req, res) => {
  try {
    const { _id } = req.headers;
    const query = {};
    if (_id) {
      query._id = _id;
    }
    PostsModel.findOneAndUpdate(query, req.body, (error, result) => {
      if (result) {
        res.status(200).send({
          status: true,
          code: 200,
          message: "Post Updated Successfully",
          result,
        });
      }
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(400).send(`got an error`, error.message);
  }
});

app.delete("/api/deletepost", async (req, res) => {
  try {
    const { _id } = req.headers;
    const query = {};
    if (_id) {
      query._id = _id;
    }
    PostsModel.findOneAndDelete(query, {}, (error, result) => {
      if (error) {
        res.status(400).send(`got an error`, error.message);
      } else {
        if (result) {
          console.log(result);
          res.status(200).send({
            status: true,
            code: 200,
            message: "Post Deleted Successfully",
            result,
          });
        }
      }
    });
  } catch (error) {
    console.log("error", error.message);
    res.status(500).send(`got an error`, error.message);
  }
});

mongoose.connection.on("connected", () => console.log("Database Connected..."));
mongoose.connection.on("error", (error) =>
  console.log(`Error${error.message}`)
);

app.listen(PORT, () => {
  console.log(`Server is Listening on Http://localhost:${PORT}`);
});
