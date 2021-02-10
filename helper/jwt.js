const jwt = require("jsonwebtoken");
const response = require("../helper/response");
let code;
let massage;
let data;

module.exports = {
  JWTSign: (id, isAdmin) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          _id: id,
          _isAdmin: isAdmin,
          createdAt: Date.now(),
        },
        "key-api",
        (err, key) => {
          resolve(key);
          reject(err);
        }
      );
    });
  },
  JWTAuth: (req, res, next) => {
    const headerToken = req.headers.authorization;
    const token = headerToken ? headerToken.split(" ")[1] : undefined;
    if (token) {
      jwt.verify(token, "key-api", function (err, decode) {
        if (err) {
          throw new Error(err.message);
        } else {
          req.payload = decode;
          next();
        }
      });
    } else {
      throw new Error("Invalid Signature Token Key");
    }
  },
};
