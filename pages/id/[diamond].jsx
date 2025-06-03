import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IdDetail() {
  const router = useRouter();
  const { diamond } = router.query;
  const [account, setAccount] = useState(null);
  const [images, setImages] = useState([]);
  const [viewCount, setViewCount] = useState(null);

  useEffect(() => {
    fetch("/data/idshop-data.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((a) => a.diamond == diamond);
        if (found) setAccount(found);
      });
  }, [diamond]);

  useEffect(() => {
    if (!diamond || !account) return;
    const folder = account.server.toLowerCase();

    fetch(`/api/images?folder=${folder}/${diamond}`)
      .then(res => res.json())
      .then(data => setImages(data));
  }, [diamond, account]);

  useEffect(() => {
    if (!diamond) return;
    fetch(`/api/increment-views?diamond=${diamond}`);
  }, [diamond]);

  useEffect(() => {
    if (!diamond) return;
    fetch("/data/views.json")
      .then(res => res.json())
      .then(data => {
        if (data[diamond]) setViewCount(data[diamond]);
      });
  }, [diamond]);

  if (!account) return <div style={{ padding: 20, color: '#fff' }}>กำลังโหลดข้อมูล...</div>;

  // ✅ ลิงก์เพจพร้อมข้อความ auto
  const chatText = encodeURIComponent(`สวัสดีครับ สนใจไอดี ${account.diamond} เพชรครับ ถ้าไม่ตอบทันที ผู้ให้บริการอาจหลับหรือติดธุระ โปรดรอ... ถ้าสะดวกจะติดต่อทันที`);
  const chatUrl = `https://m.me/dokkan-idshop?ref=${chatText}`;

  return (
    <div style={{
      fontFamily: "'Prompt', sans-serif",
      padding: 20,
      backgroundImage: "url('/images/space_grid.jpg')",
      backgroundSize: "cover",
      minHeight: "100vh",
      color: "#fff"
    }}>
      <button onClick={() => router.push("/")} style={{
        marginBottom: 24,
        padding: "10px 20px",
        background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        fontWeight: "bold",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        fontSize: "15px"
      }}>
        🔙 กลับหน้าร้าน
      </button>

      <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: 12 }}>
        💎 {account.diamond.toLocaleString()} เพชร / 💰 {account.price.toLocaleString()}฿
      </h2>
      <p style={{ marginBottom: 8 }}>📱 ระบบ: {account.system}</p>
      <p style={{ marginBottom: 8 }}>🌐 เซิร์ฟ: {account.server}</p>

      {viewCount !== null && (
        <p style={{ marginBottom: 8, fontStyle: 'italic', color: '#aaa' }}>
          👁️ เข้าชมแล้ว {viewCount.toLocaleString()} ครั้ง
        </p>
      )}

      <div style={{
        marginBottom: 16,
        padding: "12px 16px",
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 10,
        lineHeight: 1.8
      }}>
        <p><strong>🔥 สุดยอดไอดีพรีเมียมสำหรับคนพร้อมลุย!! 🔥</strong></p>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          <li>💎 เพชรสะสม {account.diamond.toLocaleString()} เม็ด (ยังไม่ใช้)</li>
          <li>🟢 ระบบ: {account.system} พร้อมผูก Facebook ปลอดภัย</li>
          <li>🇬🇧 เซิร์ฟเวอร์: {account.server}</li>
          <li>⭐ มีตัวละคร LR/UR/SSR เต็มกล่องครบครัน</li>
          <li>🟣 มีไอเทมฟาร์มครบทั้ง Medals, Training, Support</li>
          <li>🎁 เหมาะสำหรับผู้เล่นใหม่ หรือสายเติมที่อยากเริ่มแบบเทพ</li>
        </ul>
      </div>

      <p style={{ marginBottom: 16, fontStyle: 'italic', color: '#aaa' }}>
        📸 ไอดีนี้มีรูปทั้งหมด {images.length} ภาพ
      </p>

      <div style={{ display: "flex", overflowX: "auto", gap: 10, paddingBottom: 20 }}>
        {images.map((img, idx) => (
          <img key={idx} src={img} alt={`img${idx}`} style={{
            height: 400, borderRadius: 12, border: "2px solid #fff"
          }} />
        ))}
      </div>

      {account.link && (
        <a href={account.link} target="_blank" rel="noopener noreferrer">
          <button style={{
            padding: "10px 16px",
            backgroundColor: "#1877f2",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            marginRight: 10
          }}>
            🔗 ดูโพสต์บน Facebook
          </button>
        </a>
      )}

      <a href={chatUrl} target="_blank" rel="noopener noreferrer">
        <button style={{
          padding: "10px 16px",
          backgroundColor: "#e63946",
          color: "#fff",
          fontWeight: "bold",
          borderRadius: 8,
          border: "none",
          cursor: "pointer"
        }}>
          📩 ติดต่อแชทผ่านเพจ
        </button>
      </a>
    </div>
  );
}
