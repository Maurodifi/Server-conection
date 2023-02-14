const Post = require("./postsMd");

//Mostrar todos los posts
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

//Buscar por titulo
const findByTitle = (req, res, next) => {
  const { query } = req.params;
  Post.find({ $text: { $search: query } }, (err, result) => {
    if (err) return next();
    return res.status(200).json({ result });
  });
};

//Crear un nuevo Post
const createNewPost = (req, res, next) => {
  const newPost = new Post({ ...req.body });
  newPost.save((error) => {
    if (error) return next(error);
    res.status(200).json({ message: "New post saved" });
  });
};
module.exports = { listAllPosts, findByTitle, createNewPost };