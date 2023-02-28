const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    raza: { type: String, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    descripcion: [{ body: String, date: Date }],
    castrado: { type: Boolean, default: false }, 
    postPic: {type: String, default: ""}
  },
   { timestamps: true } 
);

PostSchema.index({ raza: "text" });
/* 
crea un índice para "find by title" Esto podría funcionar en -> posts/find/:query -> http://localhost.../find/title=algo
*/

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
