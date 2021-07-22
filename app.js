const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.  Email: noelzappy@gmail.com";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Database connection with Mongoose
mongoose.connect(
  "mongodb+srv://zappy:zappy@cluster0.qednf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Checking if connection was successful or not
mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);
mongoose.connection.once("open", function () {
  console.log("Connected Successfully to MongoDB");
});

// Defining Schema
const postSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Post = mongoose.model("Post", postSchema);

// Modules setup [express, body-parser, ejs, etc]
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const _ = require("lodash");

// Home Route
app.get("/", function (req, res) {
  Post.find((err, posts) => {
    if (err) {
      console.log(err);
      return null;
    }
    console.log(posts);
    res.render("home", {
      homeContent: homeStartingContent,
      posts: posts,
    });
  });
});

// About route
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

// Contact page/route
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

// Compose blog route
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Compose form handler
app.post("/compose", (req, res) => {
  const post = {
    title: req.body.postTitle,
    content: req.body.postToPublish,
  };
  const dbPost = new Post({
    title: post.title,
    description: post.content,
  });
  dbPost.save((err, dPost) => {
    if (err) {
      return console.error(err);
    }
    console.log("Post Saved Successfully " + dPost);
  });

  res.redirect("/");
});

// Post Routing parameter
app.get("/posts/:postName", (req, res) => {
  const reqTitle = _.lowerCase(req.params.postName);
  Post.find((err, posts) => {
    if (err) {
      console.log(err);
      return;
    }

    posts.forEach((post) => {
      const storedTitle = _.lowerCase(post.title);
      if (storedTitle === reqTitle) {
        res.render("post", {
          title: post.title,
          content: post.description,
        });
      }
    });
  });
});

// 404 Page serve
app.use((req, res) => {
  res.status(404);
  res.render("lost");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
