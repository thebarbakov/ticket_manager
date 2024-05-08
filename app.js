const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { errors } = require("celebrate");
// const cron = require("./utils/cron")
// const telegram = require("./utils/telegram")
const init = require("./utils/init");
const cron = require("./utils/cron")

const errorHandler = require("./errors/ServerError");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const sendOrderConfirmed = require("./utils/mail/sendOrderConfirmed");

const { PORT = 3002 } = process.env;

const mongoURI = process.env.MONGO_URI;

const app = express();

mongoose.connect(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  autoIndex: true,
});

app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedCors = [
  "https://food.react.inspiro.ru",
  "http://food.react.inspiro.ru",
];

app.use((req, res, next) => {
  const { origin } = req.headers;

  if (
    allowedCors.some((e) => e.test && e.test(origin)) ||
    allowedCors.includes(origin)
  ) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
  }

  const { method } = req;
  const requestHeaders = req.headers["access-control-request-headers"];
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";

  if (method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", DEFAULT_ALLOWED_METHODS);
    res.header("Access-Control-Allow-Headers", requestHeaders);
    return res.end();
  }

  return next();
});

app.use(requestLogger);

app.use(require("./utils/rateLimits"));

(async () => await init())();
// (async () => await sendOrderConfirmed({order_id: "663b8ff2325e0c1b0928926c"}))();

app.use(helmet());

app.use("/api", require("./routes/index"));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT} port`);
});
