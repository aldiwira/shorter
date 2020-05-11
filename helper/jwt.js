const jwt = require("jsonwebtoken");
const response = require("../helper/response");
let code;
let massage;
let data;

module.exports = {
  JWTSign: (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          _id: id,
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
          code = response.CODE_ERROR;
          massage = err.message;
          data = err.name;
          res.status(code).json(response.set(code, massage, data));
        } else {
          req.payload = decode;
          next();
        }
      });
    } else {
      code = response.CODE_ERROR;
      massage = "Invalid Signature";
      data = err;
      res.status(code).json(response.set(code, massage, data));
    }
  },
};
