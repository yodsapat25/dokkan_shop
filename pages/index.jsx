import React, { useEffect, useRef, useState } from "react";

export default function IdShop() {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState("ALL");

  const videoList = [
    "/videos/clip1.mp4", "/videos/clip2.mp4", "/videos/clip3.mp4",
    "/videos/clip4.mp4", "/videos/clip5.mp4", "/videos/clip6.mp4",
    "/videos/clip7.mp4", "/videos/clip8.mp4", "/videos/clip9.mp4",
    "/videos/clip10.mp4", "/videos/clip11.mp4", "/videos/clip12.mp4",
    "/videos/clip13.mp4", "/videos/clip14.mp4", "/videos/clip15.mp4"
  ];

  useEffect(() => {
    fetch("/data/idshop-data.json")
      .then((res) => res.json())
      .then((data) => setAccounts(data))
      .catch((err) => console.error("โหลดข้อมูลล้มเหลว:", err));
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [currentIndex]);

  const handleEnded = () => {
    const nextIndex = (currentIndex + 1) % videoList.length;
    setCurrentIndex(nextIndex);
  };

  const filtered = filter === "ALL" ? accounts : accounts.filter(a => a.server === filter);

  // ✅ ฟังก์ชันแสดงข้อความเตือนตาม platform
  const getPlatformAlert = (platform) => {
    if (platform === "iOS") return "⚠️ Android หมด";
    if (platform === "Android") return "⚠️ iOS หมด";
    if (platform === "หมด") return "❌ สินค้าหมด";
    return null;
  };

  // ✅ เช็คว่าหมดไหม
  const isOutOfStock = (platform) => platform === "หมด";

  return (
    <div style={{
      fontFamily: "'Prompt', sans-serif",
      padding: 20,
      backgroundImage: "url('/images/space_grid.jpg')",
      backgroundSize: "cover",
      minHeight: "100vh",
      color: "#fff"
    }}>
      {/* ข้อความต้อนรับแบบวิ่ง */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        whiteSpace: "nowrap",
        border: "2px solid gold",
        borderRadius: 12,
        backgroundColor: "rgba(38, 20, 202, 0.5)",
        padding: "8px 0",
        marginBottom: 24,
        display: "flex",
        alignItems: "center"
      }}>
        <img
          src="/images/goku_riding_elo.jpg"
          alt="Goku riding cloud"
          style={{ height: 32, marginRight: 12 }}
        />
        <div style={{
          display: "inline-block",
          animation: "scrollText 40s linear infinite",
          fontWeight: "bold",
          color: "#ffcc00",
          whiteSpace: "nowrap"
        }}>
          ยินดีต้อนรับลูกค้าทุกท่านที่เข้ามาเยี่ยมชม ท่านใดสนใจไอดีราคาไหนเชิญเลือกชมกันได้มากมาย ทั้งเซิฟ GB JP ระบบ แอนดรอย ไอโอเอส
        </div>
        <style>{`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
      </div>

      <img
        src="/images/banner.jpg"
        alt="ปกร้าน"
        style={{
          width: "100%",
          maxHeight: 260,
          objectFit: "cover",
          borderRadius: 16,
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
          marginBottom: 24
        }}
      />

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
        <video
          ref={videoRef}
          src={videoList[currentIndex]}
          controls
          playsInline
          onEnded={handleEnded}
          style={{
            width: "100%",
            maxWidth: 720,
            maxHeight: 400,
            borderRadius: 12
          }}
        />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
        flexWrap: "wrap"
      }}>
        <h1 style={{
          fontSize: "1.8rem",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8
        }}>
          🔥 ซื้อ ขาย ไอดีดราก้อนบอลโดคัง dokkan buy sell
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <a href="https://www.facebook.com/groups/dbzdokbattle" target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#d32f2f", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>FB กลุ่มพูดคุย</a>
          <a href="https://www.facebook.com/groups/267533331383841/" target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#2e7d32", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>กลุ่มซื้อขาย #1</a>
          <a href="https://www.facebook.com/groups/415690988875673/" target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#2e7d32", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>กลุ่มซื้อขาย #2</a>
          <a href="https://www.facebook.com/groups/238260723689185/" target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#2e7d32", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>กลุ่มซื้อขาย #3</a>
          <a href="https://www.facebook.com/profile.php?id=100089456014248" target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#2e7d32", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>กลุ่มซื้อขายเพจ #4</a>
          <a href="https://www.facebook.com/groups/267533331383841/permalink/950188633118304"
            target="_blank" rel="noopener noreferrer"
            style={{
              padding: "6px 14px", backgroundColor: "#e53935", color: "#fff",
              fontWeight: "bold", borderRadius: 8, textDecoration: "none", fontSize: "14px"
            }}>
            เครดิตผู้ขาย แอดยศ กดตรงลิ้งนี้
          </a>
        </div>
      </div>

      {/* ⭐ ไอดีพิเศษ */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
        <div style={{
          width: 200,
          background: "linear-gradient(135deg, #2a1a00, #4d3000)",
          border: "2px solid #ffcc00",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 0 30px rgba(255,204,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: "#fff",
        }}>
          <div style={{
            background: "#ffcc00", color: "#000", fontWeight: "bold",
            fontSize: 11, padding: "3px 10px", borderRadius: 20, marginBottom: 8,
          }}>⭐ ไอดีพิเศษ</div>

          <div style={{
            fontWeight: 700, fontSize: 15, marginBottom: 4,
            textAlign: "center", color: "#ffcc00",
          }}>ไอดีรอพาส 3</div>

          <div style={{
            fontSize: 12, marginBottom: 10, textAlign: "center", opacity: 0.9,
          }}>ตู้WW เวอวาย (GDC)</div>

          <img
            src="/images/special/rp3-cover.jpg"
            alt="ไอดีรอพาส 3"
            style={{
              width: "100%", borderRadius: 8, marginBottom: 10,
              border: "1px solid rgba(255,204,0,0.3)",
            }}
            onError={(e) => { e.target.style.display = "none"; }}
          />

          <div style={{ fontSize: 12, marginBottom: 4 }}>💎 1,500 - 9,000+ เพชร</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>💰 500 - 1,350฿</div>
          <div style={{ fontSize: 12, marginBottom: 4 }}>📱 ระบบ: Android/iOS</div>
          <div style={{ fontSize: 12, marginBottom: 10 }}>🌐 เซิร์ฟ: GB</div>

          <button
            onClick={() => { window.location.href = "/special"; }}
            style={{
              width: "100%", padding: "6px",
              background: "linear-gradient(90deg, #ffcc00, #ff9900)",
              color: "#000", fontWeight: "bold", borderRadius: 6,
              border: "none", cursor: "pointer", marginBottom: 6, fontSize: 13,
            }}
          >🛒 ดูราคา / สั่งซื้อ</button>

          <a href="https://www.facebook.com/share/p/19QPJMb8RC/" target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}>
            <button style={{
              width: "100%", padding: "6px", background: "#1877f2", color: "#fff",
              fontWeight: "bold", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12,
            }}>🔗 ดูตัวอย่าง Facebook</button>
          </a>
        </div>
      </div>

      {/* ฟิลเตอร์ */}
      <div style={{ marginBottom: 24 }}>
        {['ALL', 'JP', 'GB'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            style={{
              marginRight: 10, padding: "8px 16px", borderRadius: 8,
              border: "1px solid #ccc",
              backgroundColor: filter === type ? "#333" : "#fff",
              color: filter === type ? "#fff" : "#000",
              fontWeight: 500, cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
            }}
          >{type === 'ALL' ? 'ทั้งหมด' : type}</button>
        ))}
      </div>

      {/* การ์ดไอดีปกติ */}
      <div style={{
        display: "flex", flexWrap: "wrap",
        justifyContent: "center", gap: 20
      }}>
        {filtered.map((acc, index) => {
          const isOut = isOutOfStock(acc.platform);
          const alert = getPlatformAlert(acc.platform);

          return (
            <div
              key={index}
              style={{
                width: 200,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                display: "flex", flexDirection: "column", alignItems: "center",
                color: "#000",
                opacity: isOut ? 0.55 : 1,
              }}
            >
              <div style={{
                fontWeight: 700, fontSize: 15, marginBottom: 6, textAlign: "center"
              }}>
                💎 {acc.diamond.toLocaleString()} เพชร<br />💰 {acc.price.toLocaleString()}฿
              </div>

              <div style={{ fontSize: 13, marginBottom: 4 }}>
                📱 ระบบ: {acc.platform === "หมด" ? "-" : (acc.platform || "ไม่ระบุ")}
              </div>

              {/* ✅ ข้อความเตือน platform */}
              {alert && (
                <div style={{
                  fontSize: 12,
                  color: "#e63946",
                  fontWeight: "bold",
                  marginBottom: 6,
                  textAlign: "center"
                }}>
                  {alert}
                </div>
              )}

              <div style={{ fontSize: 13, marginBottom: 10 }}>
                🌐 เซิร์ฟ: {acc.server || "ไม่ระบุ"}
              </div>

              <img
                src={`/images/${acc.server.toLowerCase()}/${acc.diamond}/preview.jpg`}
                alt="ภาพหน้าปก"
                style={{
                  width: "100%", borderRadius: 8, marginBottom: 10,
                  border: "1px solid #ddd",
                  filter: isOut ? "grayscale(100%)" : "none",
                }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <button
                onClick={() => { window.location.href = `/id/${acc.diamond}`; }}
                style={{
                  width: "100%", padding: "6px", backgroundColor: "#ff9900",
                  color: "#fff", fontWeight: "bold", borderRadius: 6,
                  border: "none", cursor: "pointer", marginBottom: 6
                }}
              >📷 ดูรูปทั้งหมด</button>

              {/* ✅ ปุ่มสั่งซื้อ — disable ถ้าหมด */}
              {isOut ? (
                <button
                  disabled
                  style={{
                    width: "100%", padding: "8px",
                    background: "#999", color: "#fff",
                    fontWeight: "bold", borderRadius: 6,
                    border: "none", cursor: "not-allowed",
                    marginBottom: 6, fontSize: 14
                  }}
                >❌ สินค้าหมด</button>
              ) : (
                <button
                  onClick={() => {
                    window.location.href = `/order?diamond=${acc.diamond}&price=${acc.price}`;
                  }}
                  style={{
                    width: "100%", padding: "8px",
                    background: "linear-gradient(90deg, #ff9900, #ffcc00)",
                    color: "#000", fontWeight: "bold", borderRadius: 6,
                    border: "none", cursor: "pointer", marginBottom: 6, fontSize: 14
                  }}
                >🛒 สั่งซื้อ</button>
              )}

              {acc.link && (
                <a href={acc.link} target="_blank" rel="noopener noreferrer" style={{ width: "100%", marginBottom: 6 }}>
                  <button style={{
                    width: "100%", padding: "6px", backgroundColor: "#1877f2",
                    color: "#fff", fontWeight: "bold", borderRadius: 6,
                    border: "none", cursor: "pointer"
                  }}>🔗 ดูไอดีบน Facebook</button>
                </a>
              )}

              <a
                href={`https://m.me/kowit.goodding?text=${encodeURIComponent(`สวัสดีครับ สนใจไอดี ${acc.diamond} เพชร ราคา ${acc.price} บาทครับ`)}`}
                target="_blank" rel="noopener noreferrer" style={{ width: "100%" }}
              >
                <button style={{
                  width: "100%", padding: "6px", backgroundColor: "#e63946",
                  color: "#fff", fontWeight: "bold", borderRadius: 6,
                  border: "none", cursor: "pointer"
                }}>📩 ติดต่อสอบถามผ่านแชท</button>
              </a>
            </div>
          );
        })}
      </div>

      {/* โปรโมทเกมอื่นด้านล่างสุด */}
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginTop: 40 }}>
        <img src="/images/banner_new.jpg" alt="promo3" style={{ width: 220, borderRadius: 12 }} />
        <img src="/images/banner_new.jpg" alt="promo4" style={{ width: 220, borderRadius: 12 }} />
        <img src="/images/banner_new.jpg" alt="promo5" style={{ width: 220, borderRadius: 12 }} />
      </div>
    </div>
  );
}