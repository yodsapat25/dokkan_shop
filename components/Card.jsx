export default function Card({ id, server, diamond, price, image }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: 12,
      padding: 12,
      width: 220,
      background: "#fff"
    }}>
      <img src={image} alt={id} style={{ width: "100%", borderRadius: 8 }} />
      <h3>ID: {id}</h3>
      <div>เซิร์ฟ: {server}</div>
      <div>เพชร: {diamond}</div>
      <div>ราคา: {price} บาท</div>
      <a href={`/buy?id=${id}`}>
        <button style={{ marginTop: 8, width: "100%" }}>ซื้อไอดีนี้</button>
      </a>
    </div>
  );
}
