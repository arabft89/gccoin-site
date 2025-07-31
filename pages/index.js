export default function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold" }}>
        GCCoin — The Digital Asset of the Gulf 🌍
      </h1>
      <p style={{ marginTop: "1rem", fontSize: "1.2rem" }}>
        Built to unify the financial future of the GCC region with secure, Sharia-compliant blockchain utility.  
        GCCoin serves as a trusted digital layer for remittances, rewards, staking, and decentralized governance.
      </p>

      <div style={{ marginTop: "2rem" }}>
        <a
          href="/GCCoin_Whitepaper_v1_EN_FULL.docx"
          download
          style={{
            display: "inline-block",
            marginRight: "1rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007b8a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none"
          }}
        >
          Download Whitepaper (EN)
        </a>

        <a
          href="/GCCoin_Whitepaper_v1_AR_FULL.docx"
          download
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007b8a",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none"
          }}
        >
          تحميل الورقة البيضاء (AR)
        </a>
      </div>
    </main>
  );
}
