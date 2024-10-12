import ytdl from "@distube/ytdl-core";
import { errorResponse } from "../utils/responseHandlers.js";
import fs from "fs";

export default async function getVideo(videoURL, format, resolution, res) {
  console.log(`URL: ${videoURL}, Format: ${format}, Resolution: ${resolution}`);
  try {
    const agent = ytdl.createAgent(
      JSON.parse(fs.readFileSync("cooks.json"))
    );

    const info = await ytdl.getInfo(videoURL, { agent });
    console.log("Got video info:", info);

    const selectedFormat = ytdl.chooseFormat(info.formats, {
      filter: (f) => {
        return f.container === format && f.qualityLabel === resolution;
      },
    });

    if (!selectedFormat) {
      console.log("Format not found");
      return errorResponse(
        res,
        `No format found for ${format} at ${resolution}`
      );
    }

    res.setHeader("Content-Type", `video/${format}`);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="video.${format}"`
    );
    res.setHeader("Transfer-Encoding", "chunked");

    console.log("Starting to stream video...");

    ytdl(videoURL, { format: selectedFormat, agent })
      .pipe(res)
      .on("error", (err) => {
        console.log("Error streaming video:", err);
        res.status(500).json({ error: "Error streaming video" });
      })
      .on("finish", () => {
        console.log("Streaming finished successfully.");
      });
  } catch (err) {
    console.error("Error in getVideo function:", err);
    errorResponse(res, err);
  }
}
