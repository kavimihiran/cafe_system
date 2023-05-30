const express = require("express");
const connection = require("../connection");
const router = express.Router();

router.post("/add", (req, res, next) => {
  let category = req.body;
  query = "Insert into category (name) values(?)";
  connection.query(query, [category.name], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "category added sucessfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get", (req, res, next) => {
  var query = "Select * from category order by name";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch("/update", (req, res, next) => {
  let category = req.body;
  var query = "update category set name=? where id=?";
  connection.query(query, [category.name, category.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "category id does not exsit" });
      }
      return res.status(200).json({ message: "category updated sucessfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
