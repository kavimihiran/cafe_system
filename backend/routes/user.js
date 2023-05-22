const express = require("express");
const connection = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();
var auth = require("../services/authentication");
var checkrole = require("../services/checkRole");

router.post("/signup", (req, res) => {
  let user = req.body;
  query = "Select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        query =
          "Insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
        connection.query(
          query,
          [user.name, user.contactNumber, user.email, user.password],
          (err, results) => {
            if (!err) {
              return res
                .status(200)
                .json({ message: "sucessfully registered" });
            } else {
              return res.status(500).json({ message: "insertion error" });
            }
          }
        );
      } else {
        return res.status(400).json({ message: "Email already exsists" });
      }
    } else {
      return res.status(500).json({ message: "selection error" });
    }
  });
});

router.post("/login", (req, res) => {
  const user = req.body;
  query = "select email,password,role,status from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0 || results[0].password != user.password) {
        return res
          .status(401)
          .json({ message: "Incorrect username or password" });
      } else if (results[0].status === "false") {
        return res.status(401).json({ message: "wait for admin approval" });
      } else if (results[0].password == user.password) {
        const response = { email: results[0].email, role: results[0].role };
        const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, {
          expiresIn: "8h",
        });
        res.status(200).json({ token: accessToken });
      } else {
        return res.status(400).json({ message: "please try again" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

router.post("/forgotPassword", (req, res) => {
  const user = req.body;
  query = "Select email,password from user where email=?";
  connection.query(query, [user.email], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res
          .status(200)
          .json({ message: "Password sent sucessfully to your email" });
      } else {
        var mailOptions = {
          from: process.env.EMAIL,
          to: results[0].email,
          subject: "password by cafe management",
          html:
            "<p><b>Your Login details for cafe management system</b><br><b>Email:</b>" +
            results[0].email +
            "<br><b>Password</b>" +
            results[0].password +
            "<br><a href='http://localhost:4200'>Click here to Login</a>" +
            "</p>",
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("email sent" + info.response);
          }
        });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get("/get", auth.authenticateToken, checkrole.checkRole, (req, res) => {
  var query =
    "Select id,name,email,contactNumber,status from user where role='user'";
  connection.query(query, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.patch(
  "/update",
  auth.authenticateToken,
  checkrole.checkRole,
  (req, res) => {
    let user = req.body;
    var query = "update user set status=? where id=?";
    connection.query(query, [user.status, user.id], (err, results) => {
      if (!err) {
        if (results.affectedRows == 0) {
          return res.status(404).json({ message: "user id does not exsit" });
        }
        return res.status(200).json({ message: "user updated sucessfully" });
      } else {
        return res.status(500).json(err);
      }
    });
  }
);

router.get("/checkToken", auth.authenticateToken, (req, res) => {
  return res.status(200).json({ message: "true" });
});

router.get("/changePassword", auth.authenticateToken, (req, res) => {
  const user = req.body;
  const email = res.locals.email;
  var query = "select * from user where email=? and password=?";
  connection.query(query, [email, user.oldPassword], (err, results) => {
    if (!err) {
      if (results.length <= 0) {
        return res.status(400).json({ message: "Incorrect Old password" });
      } else if (results[0].password == user.oldPassword) {
      } else {
        return res.status(400).json({ message: "please try again later" });
      }
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;
