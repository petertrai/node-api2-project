// implement your posts router here
const Posts = require("./posts-model");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The posts information could not be retrieved" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findById(id);
    if (!post) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist" });
    } else {
      res.status(200).json(post);
    }
    console.log(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be retrieved" });
  }
});

router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  console.log(req.body);
  try {
    if (!title || !contents) {
      res
        .status(400)
        .json({ message: "Please provide title and contents for the post" });
    } else {
      const newId = await Posts.insert(req.body);
      const newPost = await Posts.findById(newId.id);
      res.status(201).json(newPost);
    }
  } catch (err) {
    res
      .status(500)
      .json({
        message: "There was an error while saving the post to the database",
      });
  }
});

router.put("/:id", async (req, res) => {
  const { title, contents } = req.body
  const { id } = req.params
  const postToUpdate = await Posts.findById(id)
  try {
    if (!postToUpdate) {
        res.status(404).json({ message: "The post with the specified ID does not exist" })
    }
    if (!title || !contents) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        const updatedPostId = await Posts.update(id, req.body)
        const updatedPost = await Posts.findById(updatedPostId)
        res.status(200).json(updatedPost)
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "The post information could not be modified" });
  }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params
    const postToDelete = await Posts.findById(id)
    try {
        if (!postToDelete) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.status(200).json(postToDelete)
            await Posts.remove(id)
            
        }   
    } catch (err) {
        res.status(500).json({ message: "The post could not be removed" })
    }
})

router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    const post = await Posts.findById(id)
    try {
        if (!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const comments = await Posts.findPostComments(id)
            res.status(200).json(comments)
        }
    } catch (err) {
        res.status(500).json({ message: "The comments information could not be retrieved" })
    }
})

module.exports = router;






