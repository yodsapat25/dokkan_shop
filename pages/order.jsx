import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import OptionItem from "../components/OptionItem";

export default function Order() {
  const router = useRouter();
  const {
    diamond,
    price: priceFromQuery,
    server: serverFromQuery,
    platform: platformFromQuery,
  } = router.query;

  const [options, setOptions] = useState(null);
  const [allAccounts, setAllAccounts] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [server, setServer] = useState("");
  const [platform, setPlatform] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addons, setAddons] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("/data/options.json").then((r) => r.json()).then(setOptions);
  }, []);

  useEffect(() => {
    fetch("/data/idshop-data.json")
      .then((r) => r.json())
      .then((data) => {
        setAllAccounts(data);
        const map = new Map();
        data.forEach((item) => {
          if (!map.has(item.price)) {
            map.set(item.price, item);
          }
        });
        const list = Array.from(map.values())
          .map((item) => ({ price: item.price, diamond: item.diamond, platform: item.platform }))
          .sort((a, b) => a.price - b.price);
        setPriceList(list);
      });
  }, []);

  useEffect(() => {
    if (priceFromQuery) setSelectedPrice(Number(priceFromQuery));
    else if (diamond) {
      const d = Number(diamond);
      const found = priceList.find((p) => Number(p.diamond) === d);
      if (found) setSelectedPrice(found.price);
    }
  }, [priceFromQuery, diamond, priceList]);

  useEffect(() => {
    if (serverFromQuery) setServer(serverFromQuery);
    if (platformFromQuery) setPlatform(platformFromQuery);
  }, [serverFromQuery, platformFromQuery]);

  // ✅ หา account ที่เลือก → ดู platform
  useEffect(() => {
    if (!selectedPrice || allAccounts.length === 0) return;
    const found = allAccounts.find((a) => a.price === selectedPrice);
    setSelectedAccount(found || null);
    if (found && found.platform === "หมด") {
      setPlatform("");
    }
  }, [selectedPrice, allAccounts]);

  if (!options || priceList.length === 0) {
    return <div style={{ padding: 20, color: "#fff" }}>กำลังโหลด...</div>;
  }

  const displayList = [...priceList];
  if (selectedPrice && !priceList.find((p) => p.price === selectedPrice)) {
    displayList.push({ price: selectedPrice, diamond: diamond || "-", platform: "Android/iOS" });
    displayList.sort((a, b) => a.price - b.price);
  }

  const getAddonPrice = (a) => (a.sale && a.salePrice ? a.salePrice : a.price);
  const addonTotal = options.addons.reduce(
    (sum, a) => (addons[a.id] ? sum + getAddonPrice(a) : sum),
    0
  );
  const total = (selectedPrice || 0) + addonTotal;

  const currentPlatform = selectedAccount?.platform || "Android/iOS";
  const androidDisabled = currentPlatform === "iOS" || currentPlatform === "หมด";
  const iosDisabled = currentPlatform === "Android" || currentPlatform === "หมด";
  const bothDisabled = currentPlatform === "หมด";

  const validate = () => {
    const errs = {};
    if (!selectedPrice) errs.price = "กรุณาเลือกราคาไอดี";
    if (bothDisabled) errs.platform = "สินค้าหมดทั้ง 2 ระบบ";
    else if (!platform) errs.platform = "กรุณาเลือกระบบ";
    if (!server) errs.server = "กรุณาเลือกเซิร์ฟ";
    if (!email) errs.email = "กรุณากรอกอีเมล";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "รูปแบบอีเมลไม่ถูกต้อง";
    if (!password) errs.password = "กรุณากรอกรหัสผ่าน";
    return errs;
  };

  const buildMessage = () => {
    const p = options.payment;
    const lines = ["สนใจสั่งซื้อไอดีครับ", ""];
    lines.push(`🌐 เซิร์ฟ: ${server}`);
    lines.push(`📱 ระบบ: ${platform}`);
    lines.push(`💰 ราคาไอดี: ${selectedPrice?.toLocaleString()} บาท`);
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
    lines.push("");
    lines.push("━━━━━━━━━━━━━━");
    lines.push("⏳ กรุณารอสักครู่ครับ");
    lines.push("หากตอบช้า ผมอาจหลับอยู่ 😴");
    lines.push("สามารถทักแชทส่วนตัวได้เลยครับ:");
    lines.push("https://m.me/kowit.goodding");
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
    width: "100%", padding: "10px 12px", borderRadius: 8,
    border: hasError ? "2px solid #ff6b6b" : "2px solid rgba(255,255,255,0.15)",
    background: "rgba(0,0,0,0.3)", color: "#fff",
    fontSize: 14, outline: "none", boxSizing: "border-box",
  });

  const errorTextStyle = {
    color: "#ff6b6b", fontSize: 12, marginTop: 4, marginBottom: 8,
  };

  const toggleStyle = (active, disabled) => ({
    padding: "8px 20px",
    background: disabled
      ? "rgba(255,255,255,0.03)"
      : active
        ? "linear-gradient(90deg,#ffcc00,#ff9900)"
        : "rgba(255,255,255,0.08)",
    border: disabled
      ? "2px solid rgba(255,255,255,0.08)"
      : active
        ? "2px solid #fff"
        : "2px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    color: disabled ? "#666" : active ? "#000" : "#fff",
    fontWeight: "bold",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.4 : 1,
  });

  const priceButtonStyle = (isSelected, platform) => {
    const isOut = platform === "หมด";
    return {
      padding: "10px 8px",
      background: isOut
        ? "rgba(255,255,255,0.03)"
        : isSelected
          ? "linear-gradient(90deg,#ffcc00,#ff9900)"
          : "rgba(255,255,255,0.08)",
      border: isOut
        ? "2px solid rgba(255,255,255,0.08)"
        : isSelected
          ? "2px solid #fff"
          : "2px solid rgba(255,255,255,0.15)",
      borderRadius: 10,
      color: isOut ? "#666" : isSelected ? "#000" : "#fff",
      fontWeight: "bold",
      cursor: isOut ? "not-allowed" : "pointer",
      textAlign: "center",
      opacity: isOut ? 0.5 : 1,
    };
  };

  return (
    <div style={{
      fontFamily: "'Prompt', sans-serif", padding: 20,
      backgroundImage: "url('/images/space_grid.jpg')",
      backgroundSize: "cover", minHeight: "100vh",
      color: "#fff", maxWidth: 600, margin: "auto",
    }}>
      <button onClick={() => router.push("/")} style={{
        marginBottom: 20, padding: "10px 20px",
        background: "linear-gradient(90deg, #4b6cb7 0%, #182848 100%)",
        color: "#fff", border: "none", borderRadius: 10,
        cursor: "pointer", fontWeight: "bold",
      }}>🔙 กลับหน้าร้าน</button>

      <h1 style={{ fontSize: "1.5rem", marginBottom: 20 }}>🛒 สั่งซื้อไอดี</h1>

      {/* 1. เลือกราคา */}
      <div style={{ marginBottom: 24 }} id="field-price">
        <h3 style={{ marginBottom: 12 }}>1. เลือกราคาไอดี *</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 8
        }}>
          {displayList.map((row) => {
            const isSelected = selectedPrice === row.price;
            const isOut = row.platform === "หมด";
            return (
              <button
                key={row.price}
                onClick={() => {
                  if (isOut) return;
                  setSelectedPrice(row.price);
                  setErrors({ ...errors, price: null, platform: null });
                }}
                disabled={isOut}
                style={priceButtonStyle(isSelected, row.platform)}
              >
                {row.price.toLocaleString()}฿
                <div style={{ fontSize: 11, fontWeight: "normal", marginTop: 2, opacity: 0.85 }}>
                  💎 {typeof row.diamond === "number" ? row.diamond.toLocaleString() : row.diamond}
                </div>
                {row.platform === "iOS" && (
                  <div style={{ fontSize: 10, color: isSelected ? "#000" : "#ff6b6b", marginTop: 2 }}>
                    iOS เท่านั้น
                  </div>
                )}
                {row.platform === "Android" && (
                  <div style={{ fontSize: 10, color: isSelected ? "#000" : "#ff6b6b", marginTop: 2 }}>
                    Android เท่านั้น
                  </div>
                )}
                {isOut && (
                  <div style={{ fontSize: 10, color: "#ff6b6b", marginTop: 2 }}>
                    ❌ สินค้าหมด
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
            <button key={s}
              onClick={() => {
                setServer(s);
                setErrors({ ...errors, server: null });
              }}
              style={toggleStyle(server === s, false)}
            >{s}</button>
          ))}
        </div>
        {errors.server && <div style={errorTextStyle}>{errors.server}</div>}
      </div>

      {/* 3. เลือกระบบ */}
      <div style={{ marginBottom: 24 }} id="field-platform">
        <h3 style={{ marginBottom: 12 }}>3. เลือกระบบ *</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            disabled={androidDisabled}
            onClick={() => {
              if (androidDisabled) return;
              setPlatform("Android");
              setErrors({ ...errors, platform: null });
            }}
            style={toggleStyle(platform === "Android", androidDisabled)}
          >Android</button>
          <button
            disabled={iosDisabled}
            onClick={() => {
              if (iosDisabled) return;
              setPlatform("iOS");
              setErrors({ ...errors, platform: null });
            }}
            style={toggleStyle(platform === "iOS", iosDisabled)}
          >iOS</button>
        </div>

        {/* ✅ แจ้งเตือนใต้ปุ่ม */}
        {currentPlatform === "iOS" && (
          <div style={{
            marginTop: 8, padding: "8px 12px",
            background: "rgba(230,57,70,0.15)",
            border: "1px solid rgba(230,57,70,0.5)",
            borderRadius: 8, fontSize: 13, color: "#ff6b6b",
          }}>⚠️ ไอดีนี้มีแค่ iOS เท่านั้น (Android หมด)</div>
        )}
        {currentPlatform === "Android" && (
          <div style={{
            marginTop: 8, padding: "8px 12px",
            background: "rgba(230,57,70,0.15)",
            border: "1px solid rgba(230,57,70,0.5)",
            borderRadius: 8, fontSize: 13, color: "#ff6b6b",
          }}>⚠️ ไอดีนี้มีแค่ Android เท่านั้น (iOS หมด)</div>
        )}
        {currentPlatform === "หมด" && (
          <div style={{
            marginTop: 8, padding: "8px 12px",
            background: "rgba(230,57,70,0.15)",
            border: "1px solid rgba(230,57,70,0.5)",
            borderRadius: 8, fontSize: 13, color: "#ff6b6b",
          }}>❌ สินค้าหมดทั้ง 2 ระบบ</div>
        )}

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
            label={a.label} price={a.price}
            salePrice={a.salePrice} sale={a.sale}
          />
        ))}
      </div>

      {/* 5. ข้อมูลผูกไอดี */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ marginBottom: 12 }}>5. ข้อมูลผูกไอดี *</h3>
        <div style={{
          padding: "12px 14px", marginBottom: 12,
          background: "rgba(255,204,0,0.12)",
          border: "1px solid rgba(255,204,0,0.4)",
          borderRadius: 10, fontSize: 13, lineHeight: 1.7, color: "#ffe6a1",
        }}>
          ⚠️ <strong>คำแนะนำสำคัญ:</strong><br />
          กรุณาใช้อีเมล <strong>สมัครใหม่</strong> หรืออีเมลที่ <strong>ไม่มีไอดีเกมอื่นผูกอยู่</strong><br />
          เพราะไอดีนี้จะถูกผูกกับอีเมลนั้นทันที
        </div>

        <div id="field-email">
          <input type="email"
            placeholder="อีเมล (สมัครใหม่ / ยังไม่ผูกไอดีเกม)"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setErrors({ ...errors, email: null }); }}
            style={inputStyle(!!errors.email)}
          />
          {errors.email && <div style={errorTextStyle}>{errors.email}</div>}
        </div>

        <div id="field-password">
          <input type="text"
            placeholder="รหัสผ่าน (สำหรับผูกไอดี)"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setErrors({ ...errors, password: null }); }}
            style={inputStyle(!!errors.password)}
          />
          {errors.password && <div style={errorTextStyle}>{errors.password}</div>}
        </div>
      </div>

      {/* สรุปราคา */}
      <div style={{
        padding: 16, background: "rgba(0,0,0,0.4)",
        borderRadius: 12, marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>เซิร์ฟ</span><span>{server || "-"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>ระบบ</span><span>{platform || "-"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span>ราคาไอดี</span><span>{(selectedPrice || 0).toLocaleString()} ฿</span>
        </div>
        {options.addons.map((a) =>
          addons[a.id] ? (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>{a.label}</span>
              <span>+{getAddonPrice(a).toLocaleString()} ฿</span>
            </div>
          ) : null
        )}
        <hr style={{ borderColor: "rgba(255,255,255,0.2)", margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: "bold" }}>
          <span>รวม</span>
          <span style={{ color: "#ffcc00" }}>{total.toLocaleString()} ฿</span>
        </div>
      </div>

      <button onClick={handleConfirm} style={{
        width: "100%", padding: "14px",
        background: "linear-gradient(90deg,#ff9900,#ffcc00)",
        color: "#000", fontSize: 16, fontWeight: "bold",
        border: "none", borderRadius: 12, cursor: "pointer",
      }}>✅ ยืนยัน → ทักแชทเพจ</button>

      <p style={{ fontSize: 12, color: "#aaa", textAlign: "center", marginTop: 12 }}>
        ระบบจะเปิด Messenger พร้อมข้อความสรุปให้คุณส่ง
      </p>
    </div>
  );
}