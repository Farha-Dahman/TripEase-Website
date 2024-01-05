import blogModel from "../../db/model/blog.model.js";
import cloudinary from "../../services/cloudinary.js";

export const createBlog = async (req, res, next) => {
  const { title, content } = req.body;
  const author = req.user._id;
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/user/${req.user._id}/blogs`,
    }
  );
  const newBlog = await blogModel.create({
    title,
    content,
    author,
    image: { public_id, secure_url },
  });
  res.status(201).json({
    message: "success",
    blog: newBlog,
  });
};

export const getAllBlogs = async (req, res, next) => {
  const blogs = await blogModel.find().populate("author", "userName");
  res.status(200).json({ message: "success", blogs });
};

export const getSpecificBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const blog = await blogModel.findById(blogId).populate("author", "userName");
  if (!blog) {
    return res.status(404).json({ message: "Blog post not found" });
  }
  res.status(200).json({ message: "success", blog });
};

export const updateBlog = async (req, res, next) => {
  const { blogId } = req.params;

  const blog = await blogModel.findById(blogId);
  if (!blog) {
    return res.status(404).json({ message: "This blog is not found!" });
  }
  if (req.body.title) {
    blog.title = req.body.title;
  }
  if (req.body.content) {
    blog.content = req.body.content;
  }

  blog.updatedAt = Date.now();
  await blog.save();
  res.status(200).json({ message: "success", blog: blog });
};

export const deleteBlog = async (req, res, next) => {
  const { blogId } = req.params;
  const deletedBlog = await blogModel.findByIdAndDelete(blogId);

  if (!deletedBlog) {
    return res.status(404).json({ message: "Blog post not found" });
  }

  res.status(200).json({ message: "success", blogPost: deletedBlog });
};
