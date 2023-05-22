const express = require("express");
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");
var checkrole = require("../services/checkRole");

router.post("/add", auth.authenticateToken, checkrole.checkRole, (req, res) => {
  let product = req.body;
  query =
    "Insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
  connection.query(
    query,
    [product.name, product.categoryId, product.description, product.price],
    (err, results) => {
      if (!err) {
        return res.status(200).json({ message: "product added sucessfully" });
      } else {
        return res.status(500).json(err);
      }
    }
  );
});

router.get("/get", auth.authenticateToken, (req, res, next) => {
  var query =
    "Select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN catergory as c where p.categoryId = c.id";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/getByCategory/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query =
    "Select id,name from product where categoryId=? and status='true'";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/getById/:id", auth.authenticateToken, (req, res, next) => {
  const id = req.params.id;
  var query = "Select id,name,description,price from product where id=? ";
  connection.query(query, [id], (err, results) => {
    if (!err) {
      return res.status(200).json(results[0]);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkrole.checkRole,
  (req, res, next) => {
    let product = req.body;
    var query =
      "update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(
      query,
      [
        product.name,
        product.categoryId,
        product.description,
        product.price,
        product.id,
      ],
      (err, results) => {
        if (!err) {
          if (results.affectedRows == 0) {
            return res
              .status(404)
              .json({ message: "product id does not exsit" });
          }
          return res
            .status(200)
            .json({ message: "product updated sucessfully" });
        } else {
          return res.status(500).json(err);
        }
      }
    );
  }
);

router.delete(
  "/delete/:id",
  auth.authenticateToken,
  checkrole.checkRole,
  (req, res, next) => {
    const id = req.params.id;
    var query = "delete from product where id=?";
    connection.query(query, [id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "product id does not exsit" });
        }
        return res.status(200).json({ message: "product deleted sucessfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.patch(
  "/updateStatus",
  auth.authenticateToken,
  checkrole.checkRole,
  (req, res, next) => {
    let product = req.body;
    var query = "update product set status=? where id=?";
    connection.query(query, [product.status, product.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "product id does not exsit" });
        }
        return res
          .status(200)
          .json({ message: "product status updated sucessfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

module.exports = router;
