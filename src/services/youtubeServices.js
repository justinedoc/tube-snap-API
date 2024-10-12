import ytdl from "@distube/ytdl-core";
import { errorResponse } from "../utils/responseHandlers.js";

export default async function getVideo(videoURL, format, resolution, res) {
  console.log(`URL: ${videoURL}, Format: ${format}, Resolution: ${resolution}`);
  try {
    const info = await ytdl.getInfo(videoURL, {
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Cookie:
            "SIDCC=AKEyXzVq5RLYH1RAbx6dmNTkUIMAjS91O_XbF1avAcMv8QaGAujz66e476eBjK_c6WPeTWJy; __Secure-1PSIDCC=AKEyXzWUWDdCdGAQZMW7YF0Fko1THfWNlAd0te0SQdB3o5CgJXJaqcMEDxkYFgKcK3xeHsOPuFQ; __Secure-3PSIDCC=AKEyXzVhTvV8eKhHUhaPBudb_TIT-dr7tC07vnVPzrZb6H9jyei4ihMY8QesUFlhpOQ3mb6sJ",
        },
      },
    });
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

    ytdl(videoURL, {
      format: selectedFormat,
      requestOptions: {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Cookie:
            "SIDCC=AKEyXzVq5RLYH1RAbx6dmNTkUIMAjS91O_XbF1avAcMv8QaGAujz66e476eBjK_c6WPeTWJy; __Secure-1PSIDCC=AKEyXzWUWDdCdGAQZMW7YF0Fko1THfWNlAd0te0SQdB3o5CgJXJaqcMEDxkYFgKcK3xeHsOPuFQ; __Secure-3PSIDCC=AKEyXzVhTvV8eKhHUhaPBudb_TIT-dr7tC07vnVPzrZb6H9jyei4ihMY8QesUFlhpOQ3mb6sJ",
        },
      },
    })
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
