export const errorResponse = (res, error) =>
  res.status(500).json({ success: false, message: error });
