import { useEffect, useCallback } from "react";
import ReactFlow, {
  MiniMap, Controls, Background,
  addEdge, useNodesState, useEdgesState,
  Handle, Position,
} from "reactflow";
import "reactflow/dist/style.css";
import { ASSET_TYPES } from "./constants";

const icon = (type) => ASSET_TYPES.find(a => a.type === type)?.icon || "📦";

function AssetNode({ data }) {
  const borderColor =
    data.exposure === "public"     ? "#ff6480" :
    data.exposure === "restricted" ? "#fbbf24" :
    "rgba(56,189,248,0.3)";

  return (
    <div style={{
      background: "var(--bg-card-solid)",
      border: `1px solid ${borderColor}`,
      borderRadius: 8,
      padding: "12px 16px",
      minWidth: 130,
      fontFamily: "'JetBrains Mono', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4,
      position: "relative",
      boxShadow: data.exposure === "public"
        ? "0 0 12px rgba(255,100,128,0.2)"
        : "0 0 8px rgba(56,189,248,0.1)",
    }}>
      <Handle type="target" position={Position.Top} style={{ background: "#38bdf8", border: "2px solid rgba(56,189,248,0.3)", width: 8, height: 8 }} />
      <button
        onClick={() => data.onDelete(data.id)}
        style={{ position: "absolute", top: 4, right: 4, background: "transparent", border: "none", color: "#ff6480", cursor: "pointer", fontSize: 11, padding: "2px 5px", opacity: 0.7 }}
      >✕</button>
      <div style={{ fontSize: 22 }}>{icon(data.asset_type)}</div>
      <div style={{ color: "var(--text)", fontSize: 11, fontWeight: 600, textAlign: "center" }}>{data.name}</div>
      <div style={{ color: "var(--accent)", opacity: 0.5, fontSize: 9, letterSpacing: 1 }}>{data.asset_type?.replace(/_/g, " ").toUpperCase()}</div>
      <div style={{
        fontSize: 9, padding: "2px 6px", borderRadius: 3, letterSpacing: 1,
        background: data.exposure === "public" ? "rgba(255,100,128,0.15)" : "rgba(56,189,248,0.1)",
        color: data.exposure === "public" ? "#ff6480" : "#38bdf8",
      }}>{data.exposure}</div>
      <Handle type="source" position={Position.Bottom} style={{ background: "#38bdf8", border: "2px solid rgba(56,189,248,0.3)", width: 8, height: 8 }} />
    </div>
  );
}

const nodeTypes = { asset: AssetNode };

export default function GraphCanvas({ assets, connections, analysisResults, onConnect, onDeleteAsset }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(assets.map((a, i) => ({
      id: String(a.id),
      type: "asset",
      position: { x: a.pos_x || (i % 4) * 230 + 80, y: a.pos_y || Math.floor(i / 4) * 180 + 80 },
      data: { ...a, id: String(a.id), onDelete: onDeleteAsset },
    })));
  }, [assets, analysisResults, onDeleteAsset]);

  useEffect(() => {
    setEdges(connections.map(c => ({
      id: String(c.id),
      source: String(c.source_id),
      target: String(c.target_id),
      label: c.protocol,
      animated: !c.encrypted,
      style: { stroke: c.encrypted ? "#38bdf8" : "rgba(255,100,128,0.5)", strokeWidth: 2 },
      labelStyle: { fill: "#38bdf8", fontSize: 10, fontFamily: "'JetBrains Mono', monospace" },
      labelBgStyle: { fill: "var(--bg-card-solid)" },
    })));
  }, [connections]);

  const handleConnect = useCallback((params) => {
    if (!params.source || !params.target) return;
    setEdges(eds => addEdge(params, eds));
    if (onConnect) onConnect(params.source, params.target);
  }, [onConnect]);

  return (
    <div
      className="theme-card"
      style={{ flex: 1, height: "100%", borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}
    >
      {/*
        The ReactFlow canvas background is set via CSS variable so it adapts:
        dark → deep navy, light → soft blue-white
      */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ background: "var(--bg-deeper)" }}
      >
        <Background color="rgba(var(--accent-rgb),0.3)" gap={32} size={0.5} style={{ opacity: 0.3 }} />
        <Controls style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)" }} />
        <MiniMap
          style={{ background: "var(--bg-card-solid)", border: "1px solid var(--border)" }}
          nodeColor={n => n.data?.exposure === "public" ? "#ff6480" : "#38bdf8"}
        />
      </ReactFlow>
    </div>
  );
}