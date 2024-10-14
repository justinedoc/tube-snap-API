import express from "express";
import bodyparser from "body-parser";
import videoRoute from "./routes/videoRoutes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  max: 110,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const allowedOrigins = [
  "https://tube-snap.vercel.app",
  "http://localhost:3000",
];

app.use(limiter);
app.use(bodyparser.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Private-Network",
    ],
    exposedHeaders: ["Content-Length"],
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  res.sendStatus(204);
});

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  console.log("Path: ", req.path);
  console.log("host: ", req.hostname);
  next();
});

app.use("/api/videos", videoRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
