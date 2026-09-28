export default function OptionItem({ checked, onChange, label, price, salePrice, sale }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        marginBottom: 8,
        background: checked ? "rgba(255,204,0,0.15)" : "rgba(255,255,255,0.08)",
        border: checked
          ? "2px solid #ffcc00"
          : "2px solid rgba(255,255,255,0.15)",
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ width: 18, height: 18, cursor: "pointer" }}
      />
      <span style={{ flex: 1, fontSize: 14 }}>
        {label}
      </span>

      {sale && salePrice ? (
        <span style={{ textAlign: "right" }}>
          <span
            style={{
              textDecoration: "line-through",
              color: "#aaa",
              fontSize: 13,
              marginRight: 6,
            }}
          >
            {price.toLocaleString()}฿
          </span>
          <span style={{ fontWeight: "bold", color: "#ffcc00", fontSize: 15 }}>
            {salePrice.toLocaleString()}฿
          </span>
          <span style={{ marginLeft: 4 }}>🔥</span>
        </span>
      ) : (
        <span style={{ fontWeight: "bold", color: "#ffcc00" }}>
          +{price.toLocaleString()}฿
        </span>
      )}
    </label>
  );
}