import getVideo from "../services/youtubeServices.js";

export default async function downloadVideo(req, res) {
  const { videoURL, format, resolution } = req.query;

  if (!videoURL || !format || !resolution) {
    return res
      .status(400)
      .json({ error: "videoURL, format, and resolution are required" });
  }

  try {
    await getVideo(videoURL, format, resolution, res);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
