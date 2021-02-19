const packagej = require("../package.json");
const { mainRoute, redirectRoute, shorterRoute } = require("../router");

const routes = (app) => {
  app.get("/", (req, res) => {
    res.status(200).json({
      name: packagej.name,
      ver: packagej.version,
    });
  });

  app.use("/", mainRoute);
  app.use("/shorter", shorterRoute);
  app.use("/", redirectRoute);
};

module.exports = routes;
