import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Buy() {
  const router = useRouter();
  const { diamond, price } = router.query;
  const [options, setOptions] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetch("/data/options.json").then(r => r.json()).then(setOptions);
  }, []);

  if (!options) return <div style={{ padding: 20, color: "#fff" }}>กำลังโหลด...</div>;

  const p = options.payment;

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    alert("คัดลอกแล้ว: " + text);
  };

  const slipText = encodeURIComponent(
    `สวัสดีครับ โอนแล้วครับ\nไอดี: ${diamond} เพชร\nราคา: ${price} บาท\nชื่อผู้โอน: ${name}`
  );

  return (
    <div style={{
      maxWidth: 500,
      margin: "auto",
      padding: 20,
      fontFamily: "'Prompt', sans-serif",
      color: "#fff",
      minHeight: "100vh",
      backgroundImage: "url('/images/space_grid.jpg')",
      backgroundSize: "cover"
    }}>
      <button onClick={() => router.back()} style={{
        marginBottom: 16, padding: "8px 16px",
        background: "#333", color: "#fff", border: "none",
        borderRadius: 8, cursor: "pointer"
      }}>🔙 ย้อนกลับ</button>

      <h2>💳 ชำระเงิน</h2>

      <div style={{
        background: "rgba(0,0,0,0.4)",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16
      }}>
        <p><strong>ไอดี:</strong> {diamond} เพชร</p>
        <p><strong>ราคา:</strong> {price} บาท</p>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.08)",
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        lineHeight: 2
      }}>
        <h3>📱 พร้อมเพย์ / วอเลต</h3>
        <p>
          {p.promptpay}
          <button onClick={() => copy(p.promptpay)} style={{
            marginLeft: 10, padding: "4px 10px", fontSize: 12,
            background: "#ff9900", color: "#fff", border: "none",
            borderRadius: 6, cursor: "pointer"
          }}>คัดลอก</button>
        </p>

        <h3>🏦 บัญชีธนาคาร</h3>
        <p>ธนาคาร: {p.bankName}</p>
        <p>เลขบัญชี: {p.bankAccount}
          <button onClick={() => copy(p.bankAccount)} style={{
            marginLeft: 10, padding: "4px 10px", fontSize: 12,
            background: "#ff9900", color: "#fff", border: "none",
            borderRadius: 6, cursor: "pointer"
          }}>คัดลอก</button>
        </p>
        <p>ชื่อบัญชี: {p.accountName}</p>
      </div>

      <input
        type="text"
        placeholder="ชื่อผู้โอน / Line"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "100%", padding: 10, marginBottom: 12,
          borderRadius: 8, border: "none", fontSize: 14
        }}
      />

      <a
        href={`https://m.me/${options.messenger}?text=${slipText}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button style={{
          width: "100%", padding: 14,
          background: "linear-gradient(90deg,#1877f2,#0a5dc2)",
          color: "#fff", fontSize: 16, fontWeight: "bold",
          border: "none", borderRadius: 12, cursor: "pointer"
        }}>
          📩 ส่งสลิปทาง Messenger
        </button>
      </a>
    </div>
  );
}