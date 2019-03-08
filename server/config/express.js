const path = require("path");
const config = require("../config");
const express = require("express");
const cors = require("cors");
const consign = require("consign");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const modRewrite = require("connect-modrewrite");
const morgan = require("morgan");
const ejs = require("ejs");
const useRedis = require("./useRedis");

module.exports = () => {
  const app = express();

  useRedis(app);

  const port = process.env.PORT || config.port;
  app.set("port", port);

  app.set("views", "./app/views");
  app.engine("html", ejs.renderFile);
  app.set("view engine", "html");
  console.log(`config.corsOriginsAccept`, config.corsOriginsAccept);
  app.use(
    cors({
      origin: config.corsOriginsAccept,
      exposedHeaders: ["x-access-token"],
      // allowedHeaders: ['Content-Type', 'Authorization'],
      //  additionalHeaders: ['cache-control', 'x-requested-with'],
      credentials: true
    })
  );

  app.use(
    modRewrite([
      "!\\api/|\\.html|\\.js|\\.svg|\\.css|\\.png|\\.jpg|\\.woff|\\.woff2|\\.ttf|\\.manifest$ /index.html [L]"
    ])
  );

  app.use(express.static(config.publicFolder));

  app.use(compression());
  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(require("method-override")());
  app.use(helmet.hidePoweredBy({ setTo: "Cobol" }));

  consign({ cwd: path.join(process.cwd(), /*"server",*/ "app") })
    .include("models/models.js")
    .then("utils")
    .then("services")
    .then("controllers")
    .then("routes")
    .into(app);

  app.get("*", (req, res) => {
    console.log("Route/path not found");
    if (req.xhr)
      return res.status(404).send({ message: "Endereço inexistente" });
    return res.status(404).render("404.ejs");
  });

  // app.use(erro.handler({token: config.accessToken}));

  app.use((err, req, res) => {
    console.log("caiu aqui", err);

    let error = err;
    let msg;
    let status = 500;

    if (err.constructor.name === "BrError") {
      error = err.error;
      msg = typeof err.message === "string" ? err.message : err.message.message;
      status = err.params.status || 500;
    }

    if (error.stack) {
      const message = msg || "Erro interno do servidor";
      return res.status(status).send({
        message,
        messageCode: new Date()
      });
    }
  });

  return app;
};
