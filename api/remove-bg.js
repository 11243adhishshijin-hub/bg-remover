import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload error" });
    }

    const file = fs.createReadStream(files.image.filepath);

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
      const response = await fetch("https://api.remove.bg/v1.0/removebg", {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        },
        body: formData,
      });

      const buffer = await response.arrayBuffer();

      res.setHeader("Content-Type", "image/png");
      res.send(Buffer.from(buffer));

    } catch (error) {
      res.status(500).json({ error: "Failed to remove background" });
    }
  });
}
