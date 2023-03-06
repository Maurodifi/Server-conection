const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema(
  {
    raza: { type: String, required: false },
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    sexo: { type: String, required: true },
    descripcion: [{ body: String, date: Date }],
    castrado: { type: Boolean, default: false }, 
    postPic: {type: String, default: ""}
  },
   { timestamps: true } 
);

PostSchema.index({ raza: "text" });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
