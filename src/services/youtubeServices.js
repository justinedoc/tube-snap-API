import fetchProgress from "./vidDlAPI.js";
import * as dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.API_KEY;

export default async function getVideo(videoURL, resolution, res) {
  try {
    const response = await fetch(
      `https://loader.to/ajax/download.php?format=${resolution}&url=${videoURL}`,
      {
        headers: new Headers({
          Authorization: `Bearer ${apiKey}`,
        }),
      }
    );
    console.log("Finished with fetching...");

    const data = await response.json();
    const progress = await pollProgress(data?.id);

    if (!progress) {
      res.json({ message: "could not fetch requested video" }).status(500);
    }

    console.log("Starting to send...");
    res.send({ data, progress }).status(200);
  } catch (err) {
    console.error("AN error occured, Video could not be fetched: ", err);
    res.send({ message: "Video could not be fetched" }).status(500);
  }
}

async function pollProgress(id, maxRetries = 15, delay = 3000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const data = await fetchProgress(id);

    if (data && data.success && data.download_url) {
      return data;
    }

    console.log(
      `Attempt ${attempt + 1}: Progress ${data.progress}, Retrying in ${
        delay / 1000
      } seconds...`
    );

    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Download not ready after multiple attempts");
}
