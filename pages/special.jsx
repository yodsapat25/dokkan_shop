import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OptionItem from "../components/OptionItem";

export default function Special() {
  const router = useRouter();

  const [options, setOptions] = useState(null);
  const [special, setSpecial] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [server, setServer] = useState("");
  const [platform, setPlatform] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addons, setAddons] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("/data/options.json").then((r) => r.json()).then(setOptions);
    fetch("/data/special.json").then((r) => r.json()).then(setSpecial);
  }, []);

  if (!options || !special) {
    return <div style={{ padding: 20, color: "#fff" }}>กำลังโหลด...</div>;
  }

  const getAddonPrice = (a) => (a.sale && a.salePrice ? a.salePrice : a.price);
  const addonTotal = options.addons.reduce(
    (sum, a) => (addons[a.id] ? sum + getAddonPrice(a) : sum),
    0
  );
  const total = (selectedPrice || 0) + addonTotal;

  const selectedRange = special.prices.find((p) => p.price === selectedPrice);

  const validate = () => {
    const errs = {};
    if (!selectedPrice) errs.price = "กรุณาเลือกช่วงเพชร";
    if (!server) errs.server = "กรุณาเลือกเซิร์ฟ";
    if (!platform) errs.platform = "กรุณาเลือกระบบ";
    if (!email) errs.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) errs.password = "กรุณากรอกรหัสผ่าน";
    return errs;
  };

  const buildMessage = () => {
  const p = options.payment;
  const lines = [`สนใจสั่งซื้อ "${special.title}" ครับ`, ""];
  lines.push(`🌐 เซิร์ฟ: ${server}`);
  lines.push(`📱 ระบบ: ${platform}`);
  lines.push(
    `💎 เพชร: ${selectedRange.min.toLocaleString()}-${selectedRange.max.toLocaleString()}`
  );
  lines.push(`💰 ราคาไอดี: ${selectedPrice.toLocaleString()} บาท`);
  options.addons.forEach((a) => {
    if (addons[a.id]) {
      lines.push(`➕ ${a.label}: +${getAddonPrice(a).toLocaleString()} บาท`);
    }
  });
  lines.push("");
  lines.push(`📧 อีเมล: ${email}`);
  lines.push(`🔑 พาส: ${password}`);
  lines.push("");
  lines.push(`✅ รวมทั้งหมด: ${total.toLocaleString()} บาท`);
  lines.push("");
  lines.push("━━━━━━━━━━━━━━");
  lines.push("💳 ช่องทางชำระเงิน");
  lines.push("");
  lines.push(`📱 พร้อมเพย์ / วอเลต: ${p.promptpay}`);
  lines.push(`🏦 ธนาคาร: ${p.bankName}`);
  lines.push(`🔢 เลขบัญชี: ${p.bankAccount}`);
  lines.push(`👤 ชื่อบัญชี: ${p.accountName}`);
  lines.push("");
  lines.push("📸 โอนแล้วส่งสลิปกลับในแชทนี้ครับ");
  return encodeURIComponent(lines.join("\n"));
};

  const handleConfirm = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const el = document.getElementById(`field-${firstKey}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const url = `https://m.me/${options.messenger}?text=${buildMessage()}`;
    window.open(url, "_blank");
  };

  const inputStyle = (hasError) => ({
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: hasError ? "2px solid #ff6b6b" : "2px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  });

  const errorTextStyle = {
    color: "#ff6b6b",
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  };

  const toggleStyle = (active) => ({
    padding: "8px 20px",
    background: active
      ? "linear-gradient(90deg,#ffcc00,#ff9900)"
      : "rgba(255,255,255,0.08)",
    border: active ? "2px solid #fff" : "2px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    color: active ? "#000" : "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  });

  return (
    <div
      style={{
        fontFamily: "'Prompt', sans-serif",
        padding: 20,
        backgroundImage: "url('/images/space_grid.jpg')",
        backgroundSize: "cover",
        minHeight: "100vh",
        color: "#fff",
        maxWidth: 700,
        margin: "auto",
      }}
    >
      <button
        onClick={() => router.push("/")}
        style={{
          marginBottom: 20,
          padding: "10px 20px",
          background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        🔙 กลับหน้าร้าน
      </button>

      {/* Header */}
      <div
        style={{
          padding: 20,
          background: "linear-gradient(135deg, rgba(255,204,0,0.2), rgba(255,153,0,0.1))",
          border: "2px solid rgba(255,204,0,0.5)",
          borderRadius: 16,
          marginBottom: 24,
        }}
      >
        <div style={{ fontSize: 14, color: "#ffcc00", fontWeight: "bold", marginBottom: 6 }}>
          {special.badge}
        </div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>
          ⭐ {special.title}
        </h1>
        <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 12 }}>
          {special.subtitle}
        </p>

        {special.coverImage && (
          <img
            src={special.coverImage}
            alt={special.title}
            style={{
              width: "100%",
              borderRadius: 12,
              marginBottom: 12,
              border: "2px solid rgba(255,255,255,0.2)",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />
        )}

        {special.link && (
          <a
            href={special.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <button
              style={{
                width: "100%",
                padding: "10px 16px",
                background: "#1877f2",
                color: "#fff",
                fontWeight: "bold",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              🔗 ดูตัวอย่างไอดีบน Facebook
            </button>
          </a>
        )}
      </div>

      {/* Highlights */}
      <div
        style={{
          padding: 16,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 12,
          marginBottom: 20,
          lineHeight: 1.9,
        }}
      >
        <h3 style={{ marginBottom: 10 }}>📋 รายละเอียดไอดี</h3>
        <ul style={{ paddingLeft: 20, margin: 0 }}>
          {special.highlights.map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
        {special.progress && (
          <div style={{ marginTop: 12, fontSize: 14, color: "#ffcc00" }}>
            📊 ด่าน: {special.progress.stages}
            <br />
            💎 เพชรเหลือ: {special.progress.diamondLeft}
          </div>
        )}
      </div>

      {/* 1. เลือกช่วงเพชร */}
      <div style={{ marginBottom: 24 }} id="field-price">
        <h3 style={{ marginBottom: 12 }}>1. เลือกช่วงเพชร *</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 8,
          }}
        >
          {special.prices.map((p) => {
            const isSelected = selectedPrice === p.price;
            return (
              <button
                key={p.price}
                onClick={() => {
                  setSelectedPrice(p.price);
                  setErrors({ ...errors, price: null });
                }}
                style={{
                  padding: "10px 8px",
                  background: isSelected
                    ? "linear-gradient(90deg,#ffcc00,#ff9900)"
                    : "rgba(255,255,255,0.08)",
                  border: isSelected
                    ? "2px solid #fff"
                    : "2px solid rgba(255,255,255,0.15)",
                  borderRadius: 10,
                  color: isSelected ? "#000" : "#fff",
                  fontWeight: "bold",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {p.price.toLocaleString()}฿
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: "normal",
                    marginTop: 2,
                    opacity: 0.9,
                  }}
                >
                  💎 {p.min.toLocaleString()}-{p.max.toLocaleString()}
                </div>
                {p.note && (
                  <div
                    style={{
                      fontSize: 10,
                      color: isSelected ? "#000" : "#ff6b6b",
                      marginTop: 2,
                    }}
                  >
                    {p.note}
                  </div>
                )}
              </button>
            );
          })}
        </div>
        {errors.price && <div style={errorTextStyle}>{errors.price}</div>}
      </div>

      {/* 2. เลือกเซิร์ฟ */}
      <div style={{ marginBottom: 24 }} id="field-server">
        <h3 style={{ marginBottom: 12 }}>2. เลือกเซิร์ฟ *</h3>
        <div style={{ display: "flex", gap: 8 }}>
          {["GB", "JP"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setServer(s);
                setErrors({ ...errors, server: null });
              }}
              style={toggleStyle(server === s)}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.server && <div style={errorTextStyle}>{errors.server}</div>}
      </div>

      {/* 3. เลือกระบบ */}
      <div style={{ marginBottom: 24 }} id="field-platform">
        <h3 style={{ marginBottom: 12 }}>3. เลือกระบบ *</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["Android", "iOS"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlatform(p);
                setErrors({ ...errors, platform: null });
              }}
              style={toggleStyle(platform === p)}
            >
              {p}
            </button>
          ))}
        </div>
        {errors.platform && <div style={errorTextStyle}>{errors.platform}</div>}
      </div>

      {/* 4. ฟังก์ชันเพิ่ม */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>4. ฟังก์ชันเพิ่ม (ไม่บังคับ)</h3>
        {options.addons.map((a) => (
          <OptionItem
            key={a.id}
            checked={!!addons[a.id]}
            onChange={(e) => setAddons({ ...addons, [a.id]: e.target.checked })}
            label={a.label}
            price={a.price}
            salePrice={a.salePrice}
            sale={a.sale}
          />
        ))}
      </div>

      {/* 5. ข้อมูลผูกไอดี */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>5. ข้อมูลผูกไอดี *</h3>
        <div
          style={{
            padding: "12px 14px",
            marginBottom: 12,
            background: "rgba(255,204,0,0.12)",
            border: "1px solid rgba(255,204,0,0.4)",
            borderRadius: 10,
            fontSize: 13,
            lineHeight: 1.7,
            color: "#ffe6a1",
          }}
        >
          ⚠️ <strong>คำแนะนำสำคัญ:</strong>
          <br />
          กรุณาใช้อีเมล <strong>สมัครใหม่</strong> หรืออีเมลที่{" "}
          <strong>ไม่มีไอดีเกมอื่นผูกอยู่</strong>
          <br />
          เพราะไอดีนี้จะถูกผูกกับอีเมลนั้นทันที
        </div>

        <div id="field-email">
          <input
            type="email"
            placeholder="อีเมล (สมัครใหม่ / ยังไม่ผูกไอดีเกม)"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: null });
            }}
            style={inputStyle(!!errors.email)}
          />
          {errors.email && <div style={errorTextStyle}>{errors.email}</div>}
        </div>

        <div id="field-password">
          <input
            type="text"
            placeholder="รหัสผ่าน (สำหรับผูกไอดี)"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors({ ...errors, password: null });
            }}
            style={inputStyle(!!errors.password)}
          />
          {errors.password && (
            <div style={errorTextStyle}>{errors.password}</div>
          )}
        </div>
      </div>

      {/* สรุป */}
      <div
        style={{
          padding: 16,
          background: "rgba(0,0,0,0.4)",
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>เซิร์ฟ</span><span>{server || "-"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>ระบบ</span><span>{platform || "-"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>ช่วงเพชร</span>
          <span>
            {selectedRange
              ? `${selectedRange.min.toLocaleString()}-${selectedRange.max.toLocaleString()}`
              : "-"}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>ราคาไอดี</span>
          <span>{(selectedPrice || 0).toLocaleString()} ฿</span>
        </div>
        {options.addons.map((a) =>
          addons[a.id] ? (
            <div
              key={a.id}
              style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}
            >
              <span>{a.label}</span>
              <span>+{getAddonPrice(a).toLocaleString()} ฿</span>
            </div>
          ) : null
        )}
        <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "8px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          <span>รวม</span>
          <span style={{ color: "#ffcc00" }}>{total.toLocaleString()} ฿</span>
        </div>
      </div>

      <button
        onClick={handleConfirm}
        style={{
          width: "100%",
          padding: "14px",
          background: "linear-gradient(90deg,#ff9900,#ffcc00)",
          color: "#000",
          fontSize: 16,
          fontWeight: "bold",
          border: "none",
          borderRadius: 12,
          cursor: "pointer",
        }}
      >
        ✅ ยืนยัน → ทักแชทเพจ
      </button>

      {/* Note */}
      {special.note && (
        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: "rgba(255,107,107,0.1)",
            border: "1px solid rgba(255,107,107,0.4)",
            borderRadius: 10,
            fontSize: 13,
            color: "#ffb3b3",
            lineHeight: 1.7,
          }}
        >
          📝 <strong>หมายเหตุ:</strong> {special.note}
        </div>
      )}
    </div>
  );
}