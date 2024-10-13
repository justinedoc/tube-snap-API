import getVideo from "../services/youtubeServices.js";

export default async function downloadVideo(req, res) {
  const { videoURL, format, resolution } = req.query;

  if (!videoURL || !resolution) {
    res.status(400).json({ error: "video url and resolution are required" });
    return;
  }

  try {
    await getVideo(videoURL, resolution, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
