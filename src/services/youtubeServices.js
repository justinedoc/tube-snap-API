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
    const progress = await fetchProgress(data?.id);

    if (!progress) {
      res.json({ message: "could not fetch requested video" }).status(500);
    }

    console.log("Starting to send...");
    res.send({ data, progress }).status(200);
  } catch (err) {
    console.error("An error occured, Video could not be fetched: ", err);
    res.send({ message: "Video could not be fetched" }).status(500);
  }
}

