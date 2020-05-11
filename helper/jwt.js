const jwt = require("jsonwebtoken");

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
};
