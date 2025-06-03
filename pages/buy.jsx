import { useState } from "react";

export default function Buy() {
  const [name, setName] = useState("");
  const [slip, setSlip] = useState(null);

  return (
    <div style={{ maxWidth: 400, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>ฟอร์มสั่งซื้อ + แนบสลิป</h2>
      <input
        type="text"
        placeholder="ชื่อลูกค้า/Line"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: "100%", marginBottom: 8 }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={e => setSlip(e.target.files[0])}
        style={{ marginBottom: 8 }}
      />
      <button style={{ width: "100%" }}>ยืนยันสั่งซื้อ</button>
      <br />
      {slip && <img src={URL.createObjectURL(slip)} style={{ width: "100%", marginTop: 8 }} alt="slip" />}
    </div>
  );
}
