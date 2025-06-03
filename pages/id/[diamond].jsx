import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function IdDetail() {
  const router = useRouter();
  const { diamond } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/data/idshop-data.json")
      .then(res => res.json())
      .then(all => {
        const found = all.find(
          item => item.diamond == diamond && item.server.toLowerCase() === "gb"
        );
        setData(found || null);
      });
  }, [diamond]);

  if (!data) {
    return (
      <div style={{
        color: "#fff",
        textAlign: "center",
        padding: 100,
        fontSize: 36,
        background: "url('/images/bg_main.jpg') center/cover fixed"
      }}>
        <h1>ไม่พบไอดีนี้ในระบบ</h1>
      </div>
    );
  }

  return (
    <div style={{
      color: "#fff",
      background: "rgba(0,0,0,0.55)",
      borderRadius: 18,
      maxWidth: 640,
      margin: "40px auto",
      padding: 24,
      textAlign: "center"
    }}>
      <h2 style={{ fontWeight: "bold" }}>
        {data.diamond.toLocaleString()} เพชร / <span style={{ color: "#ffe25e" }}>💰 {data.price.toLocaleString()}฿</span>
      </h2>
      <div style={{ marginBottom: 16 }}>
        <b>ระบบ:</b> {data.platform} &nbsp; | &nbsp;
        <b>เซิร์ฟ:</b> {data.server}
      </div>
      <img src={`/images/gb/${data.diamond}/preview.jpg`} alt="preview" style={{
        width: 350,
        borderRadius: 16,
        border: "2px solid #222",
        marginBottom: 20
      }} />
      <div>
        <a href={data.link} target="_blank"
          style={{
            background: "#1877f2", color: "#fff", padding: "10px 28px", borderRadius: 8, fontWeight: "bold", textDecoration: "none"
          }}>🔗 ดูโพสต์นี้บน Facebook</a>
      </div>
      <div style={{ marginTop: 24 }}>
        <button onClick={() => router.push("/")} style={{
          background: "#2985ff",
          color: "#fff",
          border: 0,
          borderRadius: 8,
          padding: "8px 24px",
          fontWeight: "bold"
        }}>กลับหน้าร้าน</button>
      </div>
    </div>
  );
}
