import express from "express";
import bodyparser from "body-parser";
import videoRoute from "./routes/videoRoutes.js";
import cors from "cors";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
  windowMs: 20 * 60 * 1000,
  limit: 100,
  message: "Too many requests from this IP, please try again after 15mins",
});
const allowedOrigins = [
  "https://tube-snap.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
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
  })
);
app.use((req, res, next) => {
  console.log("Path: ", req.path);
  console.log("host: ", req.hostname);
  next();
});

app.use("/api/videos", videoRoute);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
