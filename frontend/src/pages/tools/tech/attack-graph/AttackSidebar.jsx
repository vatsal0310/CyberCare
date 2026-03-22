import { useState } from "react";
import { ASSET_TYPES, PROTOCOLS } from "./constants";

const FONT = "'JetBrains Mono', monospace";

export default function AttackSidebar({ scenario, onAddAsset, onAddConnection, assets, loading }) {
  const [tab,   setTab]   = useState("assets");
  const [name,  setName]  = useState("");
  const [type,  setType]  = useState(ASSET_TYPES[0].type);
  const [sens,  setSens]  = useState("medium");
  const [expo,  setExpo]  = useState("internal");
  const [src,   setSrc]   = useState("");
  const [tgt,   setTgt]   = useState("");
  const [proto, setProto] = useState("HTTPS");
  const [port,  setPort]  = useState("");
  const [auth,  setAuth]  = useState(true);
  const [enc,   setEnc]   = useState(false);

  const addAsset = () => {
    if (!name.trim()) return;
    onAddAsset({ name, asset_type: type, sensitivity: sens, exposure: expo });
    setName("");
  };

  const addConn = () => {
    if (!src || !tgt || src === tgt) return;
    onAddConnection({ source_id: src, target_id: tgt, protocol: proto, port: port ? parseInt(port) : null, auth_required: auth, encrypted: enc });
    setSrc(""); setTgt(""); setPort("");
  };

  const Toggle = ({ val, set }) => (
    <div
      onClick={() => set(!val)}
      style={{ width: 36, height: 20, borderRadius: 10, cursor: "pointer", position: "relative", background: val ? "#1d4ed8" : "var(--track-bg)", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: 3, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "transform 0.2s", transform: val ? "translateX(16px)" : "translateX(0)" }} />
    </div>
  );

  /* Shared style for all inputs / selects in the sidebar */
  const inp = {
    background: "var(--bg-input)",
    border: "1px solid var(--input-border)",
    color: "var(--text)",
    padding: "8px 10px",
    borderRadius: 6,
    fontFamily: FONT,
    fontSize: 12,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const lbl = {
    fontSize: 10,
    color: "var(--accent)",
    letterSpacing: 2,
    marginTop: 6,
    display: "block",
    fontFamily: FONT,
  };

  return (
    <div
      className="theme-card"
      style={{ width: 250, border: "1px solid var(--border)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", flexShrink: 0, fontFamily: FONT }}
    >
      <div style={{ fontSize: 11, color: "var(--accent)", letterSpacing: 2, marginBottom: 4 }}>🔷 ATTACKGRAPH</div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {["assets", "connect"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              padding: "7px 0",
              background: tab === t ? "rgba(var(--accent-rgb),0.12)" : "transparent",
              border: `1px solid ${tab === t ? "rgba(var(--accent-rgb),0.4)" : "var(--border)"}`,
              color: tab === t ? "var(--accent)" : "var(--text-muted)",
              borderRadius: 6,
              cursor: "pointer",
              fontFamily: FONT,
              fontSize: 11,
            }}
          >
            {t === "assets" ? "⬡ Assets" : "⟶ Connect"}
          </button>
        ))}
      </div>

      {tab === "assets" && (
        <>
          <label style={lbl}>ASSET NAME</label>
          <input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Web Server 1" />

          <label style={lbl}>TYPE</label>
          <select style={inp} value={type} onChange={e => setType(e.target.value)}>
            {ASSET_TYPES.map(a => <option key={a.type} value={a.type}>{a.icon} {a.label}</option>)}
          </select>

          <label style={lbl}>SENSITIVITY</label>
          <select style={inp} value={sens} onChange={e => setSens(e.target.value)}>
            {["low", "medium", "high", "critical"].map(v => <option key={v}>{v}</option>)}
          </select>

          <label style={lbl}>EXPOSURE</label>
          <select style={inp} value={expo} onChange={e => setExpo(e.target.value)}>
            {["public", "internal", "restricted"].map(v => <option key={v}>{v}</option>)}
          </select>

          <button
            onClick={addAsset}
            disabled={loading || !scenario}
            style={{ marginTop: 8, padding: "10px 0", background: "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12, opacity: (!scenario || loading) ? 0.4 : 1 }}
          >
            {loading ? "ADDING..." : "+ ADD ASSET"}
          </button>
        </>
      )}

      {tab === "connect" && (
        <>
          <label style={lbl}>SOURCE</label>
          <select style={inp} value={src} onChange={e => setSrc(e.target.value)}>
            <option value="">Select source...</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <label style={lbl}>TARGET</label>
          <select style={inp} value={tgt} onChange={e => setTgt(e.target.value)}>
            <option value="">Select target...</option>
            {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>

          <label style={lbl}>PROTOCOL</label>
          <select style={inp} value={proto} onChange={e => setProto(e.target.value)}>
            {PROTOCOLS.map(p => <option key={p}>{p}</option>)}
          </select>

          <label style={lbl}>PORT (optional)</label>
          <input style={inp} value={port} onChange={e => setPort(e.target.value)} placeholder="e.g. 443" type="number" />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 1, fontFamily: FONT }}>AUTH REQUIRED</span>
            <Toggle val={auth} set={setAuth} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 10, color: "var(--accent)", letterSpacing: 1, fontFamily: FONT }}>ENCRYPTED</span>
            <Toggle val={enc} set={setEnc} />
          </div>

          <button
            onClick={addConn}
            disabled={loading || !scenario}
            style={{ marginTop: 8, padding: "10px 0", background: "linear-gradient(135deg, #1d4ed8, #0369a1)", border: "none", color: "#fff", borderRadius: 6, cursor: "pointer", fontFamily: FONT, fontSize: 12, opacity: (!scenario || loading) ? 0.4 : 1 }}
          >
            {loading ? "CONNECTING..." : "⟶ ADD CONNECTION"}
          </button>
        </>
      )}
    </div>
  );
}
