const Post = require("./postsMd");
const public_url = process.env.public_url;

//list all posts
const listAllPosts = (req, res, next) => {
  Post.find()
    .then((data) => {
      !data.length ? next() : res.status(200).json(data);
    })
    .catch((error) => {
      error.status = 500;
      next(error);
    });
};

//Buscar por raza
const findByRace = (req, res, next) => {
  const { query } = req.params;
  Post.find({ $text: { $search: query } }, (err, result) => {
    if (!result) return next();
    return res.status(200).json({ result });
  });
};

//create new post
const createNewPost = (req, res, next) => {
  let pic = "";
  if (req.file) {
    pic = `${public_url}/storage/${req.file.filename}`;
  }
  const newPost = new Post({ ...req.body, postPic: pic  });
  newPost.save((error) => {
    if (error) return next(error);
    res.status(200).json({ message: "New post saved" });
  });
};
module.exports = { listAllPosts, findByRace, createNewPost };
