export default function SmartBot() {
  return (
    <div style={{ maxWidth: 500, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>ลิ้งไอดีด้วย SmartBot</h2>
      <iframe
        src="https://your-bot-url-here"
        width="100%"
        height={600}
        style={{ border: "1px solid #ddd", borderRadius: 8 }}
        title="SmartBot"
      />
      <div style={{ marginTop: 16, color: "#777" }}>
        ทำตามขั้นตอนบนบอทนี้ให้ครบ จนกว่าจะขึ้นสถานะ “ลิ้งค์สำเร็จ”
      </div>
    </div>
  );
}
