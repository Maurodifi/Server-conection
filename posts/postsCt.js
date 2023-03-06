const Post = require("./postsMd");
const public_url = process.env.public_url;

//Mostrar todos los posteos
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

//Crear un Nuevo Posteo
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

//Eliminar Posteo
const deletePost = async (req, res, next) =>{
  try{
      const post = await Post.findByIdAndDelete(req.params.id);
      res.status(200).json({ post: post.id, message: "Posteo borrado "})
  }catch (error){
      next();
  }
}
module.exports = { listAllPosts, findByRace, createNewPost, deletePost };
