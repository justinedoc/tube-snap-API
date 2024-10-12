import express from "express";
import bodyparser from "body-parser";
import videoRoute from "./routes/videoRoutes.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyparser.json());
app.use(
  cors({
    origin: "https://tube-snap.vercel.app/",
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
