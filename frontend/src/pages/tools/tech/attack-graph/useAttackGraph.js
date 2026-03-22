import { useState, useCallback } from "react";
import { api } from "./attackGraphApi";

export function useAttackGraph() {
  const [scenario, setScenario]       = useState(null);
  const [scenarios, setScenarios]     = useState([]);
  const [assets, setAssets]           = useState([]);
  const [connections, setConnections] = useState([]);
  const [analysis, setAnalysis]       = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const fetchScenarios = useCallback(async () => {
    try { const l = await api.getScenarios(); setScenarios(Array.isArray(l) ? l : []); }
    catch (e) { setError(e.message); }
  }, []);

  const createScenario = useCallback(async (name) => {
    setLoading(true);
    try {
      const s = await api.createScenario({ name });
      setScenario(s); setAssets([]); setConnections([]); setAnalysis(null);
      return s;
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const loadScenario = useCallback(async (s) => {
    setLoading(true);
    try {
      setScenario(s); setAnalysis(null);
      const [a, c] = await Promise.all([api.getAssets(s.id), api.getConnections(s.id)]);
      setAssets(Array.isArray(a) ? a : []);
      setConnections(Array.isArray(c) ? c : []);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const deleteScenario = useCallback(async (id) => {
    try {
      await api.deleteScenario(id);
      setScenarios(prev => prev.filter(s => s.id !== id));
      if (scenario?.id === id) { setScenario(null); setAssets([]); setConnections([]); setAnalysis(null); }
    } catch (e) { setError(e.message); }
  }, [scenario]);

  const addAsset = useCallback(async (sid, data) => {
    setLoading(true);
    try { const a = await api.addAsset(sid, data); if (a.id) setAssets(prev => [...prev, a]); return a; }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const removeAsset = useCallback(async (aid) => {
    await api.deleteAsset(aid);
    setAssets(prev => prev.filter(a => String(a.id) !== String(aid)));
    setConnections(prev => prev.filter(c => String(c.source_id) !== String(aid) && String(c.target_id) !== String(aid)));
  }, []);

  const addConnection = useCallback(async (sid, data) => {
    setLoading(true);
    try { const c = await api.addConnection(sid, data); if (c.id) setConnections(prev => [...prev, c]); return c; }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  const runAnalysis = useCallback(async (sid) => {
    setLoading(true); setAnalysis(null);
    try { const r = await api.analyze(sid); setAnalysis(r); return r; }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, []);

  return {
    scenario, scenarios, assets, connections, analysis, loading, error, setError,
    fetchScenarios, createScenario, loadScenario, deleteScenario,
    addAsset, removeAsset, addConnection, runAnalysis,
  };
}