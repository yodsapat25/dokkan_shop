import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { folder } = req.query;

  if (!folder) {
    return res.status(400).json({ error: "Missing folder" });
  }

  const dir = path.join(process.cwd(), 'public', 'images', folder);
  try {
    const files = fs.readdirSync(dir)
      .filter(f => /\.(jpe?g|png|webp)$/i.test(f))
      .map(f => `/images/${folder}/${f}`);

    return res.status(200).json(files);
  } catch (err) {
    return res.status(500).json({ error: "ไม่พบโฟลเดอร์หรือเกิดข้อผิดพลาด" });
  }
}
