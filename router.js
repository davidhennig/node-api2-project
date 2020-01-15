const express = require("express");

const Hubs = require("./data/db");

const router = express.Router();

router.post("/", (req, res) => {
  const userData = req.body;
  if (!userData.title || !userData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  Hubs.insert(userData)
    .then(hub => {
      Hubs.findById(hub.id).then(response => {
        res.status(201).json(response);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.post("/:id/comments", (req, res) => {
  const userData = req.body;

  Hubs.findById(req.params.id).then(hub => {
    if (hub.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
  });
  if (!userData.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  }
  Hubs.insertComment({ text: userData.text, post_id: req.params.id })
    .then(hub => {
      Hubs.findCommentById(hub.id).then(response => {
        res.status(201).json(response);
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "There was an error while saving the post to the database"
      });
    });
});

router.get("/", (req, res) => {
  Hubs.find()
    .then(hub => {
      res.status(200).json(hub);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  Hubs.findCommentById(id)
    .then(hub => {
      if (hub.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(hub);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

router.get("/:id/comments", (req, res) => {
  const { id } = req.params;
  Hubs.findPostComments(id)
    .then(hub => {
      if (hub.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      }
      res.status(200).json(hub);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: "The comments information could not be retrieved."
      });
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Hubs.findById(id).then(hub => {
    if (hub.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
    Hubs.remove(id)
      .then(hub => {
        res.status(200).json(hub);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "The post could not be removed"
        });
      });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const userData = req.body;
  if (!userData.title || !userData.contents) {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
  Hubs.findById(id).then(hub => {
    if (hub.length === 0) {
      res
        .status(404)
        .json({ message: "The post with the specified ID does not exist." });
    }
    Hubs.update(id, userData)
      .then(hub => {
        Hubs.findById(id).then(response => {
          res.status(200).json(response);
        });
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          error: "The post information could not be modified."
        });
      });
  });
});

module.exports = router;
