import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import "reflect-metadata";
import authRoute from "./routes/auth.route";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

/** Rules of our API */
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }

  next();
});

app.use('/api/auth', authRoute);

/** 404 Not Found */
app.use((req, res, next) => {
  const err = new Error("Not found");

  res.status(404).json({
    message: err.message,
  });
});

export default app;
