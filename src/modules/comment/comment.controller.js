import commentModel from "../../db/model/comment.model.js";
import postModel from "../../db/model/post.model.js";

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const newComment = await commentModel.create({
      user: userId,
      post: postId,
      content,
    });

    const updatedPost = await postModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: newComment } },
        { new: true }
      )
      .populate("comments");

    return res
      .status(201)
      .json({ message: "success", newComment, updatedPost });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await commentModel.find({ post: postId });

    return res.status(200).json({ message: "success", comments });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        error: "Unauthorized. You can only update your own comments.",
      });
    }

    comment.content = content;
    await comment.save();

    return res
      .status(200)
      .json({ message: "success", updatedComment: comment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await commentModel.findById(commentId);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          error: "Unauthorized. You can only delete your own comments.",
        });
    }

    const post = await postModel.findById(comment.post);
    if (!post) {
      return res.status(404).json({ error: "Associated post not found" });
    }

    post.comments.pull(comment._id);
    await post.save();

    await commentModel.deleteOne({ _id: comment._id });

    return res.status(200).json({ message: "success", deletedComment: comment });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
