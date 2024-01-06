import postModel from "../../db/model/post.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user._id;
  if (!req.file) {
    return res.status(400).json({ message: "No file attached to the request" });
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/user/${req.user._id}/posts`,
    }
  );
  const newPost = await postModel.create({
    title,
    content,
    author,
    image: { public_id, secure_url },
  });
  return res.status(201).json({ message: "success", post: newPost });
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await postModel.find().populate("author", "userName");
    return res.status(200).json({ message: "success", posts });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSpecificPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel
      .findById(postId)
      .populate("author", "userName");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "success", post });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;

    const updatedPost = await postModel.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "success", post: updatedPost });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deletedPost = await postModel.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json({ message: "success", post: deletedPost });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
