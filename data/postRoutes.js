const express = require("express");

const postsDB = require("./db.js");

const router = express.Router();

router.get("/", (req, res) => {
  postsDB
    .find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ error: '"Error retrieving the posts.' });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  postsDB
    .findById(id)
    .then(post => {
      if (post && post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  postsDB
    .findPostComments(id)
    .then(post => {
      if (post && post.length > 0) {
        res.status(200).json(post);
      } else {
        res
          .status(404)
          .json({ message: "There is no any comments for this post ID." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The comments information could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const body = req.body;
  console.log(body);
  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    return;
  }
  postsDB
    .insert(body)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the post to the database",
        err
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const commentInfo = { ...req.body, post_id: req.params.id };
  console.log(commentInfo);

  postsDB
    .findById(req.params.id)
    .then(post => {
      if (post.length > 0) {
        postsDB
          .insertComment(commentInfo)
          .then(post => {
            res.status(201).json(post);
          })
          .catch(err => {
            res.status(500).json({
              error:
                "There was an error while saving the comment to the database"
            });
          });
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

router.delete("/:id", (req, res) => {
  const id = req.params.id;

  postsDB
    .remove(id)
    .then(removedId => {
      if (removedId) {
        res.status(200).json(removedId);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be removed" });
    });
});

router.put("/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  console.log(body);
  if (!body.title || !body.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
    return;
  }
  postsDB
    .update(id, body)
    .then(postID => {
      if (postID) {
        res.status(200).json(postID);
      } else {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

module.exports = router;
