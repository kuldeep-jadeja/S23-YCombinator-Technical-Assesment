// submit.js — sends pipeline data to /pipelines/parse
import { useState } from 'react';

export const SubmitButton = ({ nodes = [], edges = [] }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={barStyle}>
        <div style={statsStyle}>
          <Chip label="Nodes" value={nodes.length} color="#10b981" />
          <Chip label="Edges" value={edges.length} color="#6366f1" />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...btnStyle, ...(loading ? btnDisabledStyle : {}) }}
          onMouseEnter={e => !loading && (e.currentTarget.style.background = '#5254f0')}
          onMouseLeave={e => !loading && (e.currentTarget.style.background = '#6366f1')}
        >
          {loading ? (
            <><span style={spinnerStyle}>⟳</span> Analyzing…</>
          ) : (
            '⬡ Validate Pipeline'
          )}
        </button>
      </div>

      {/* Result Modal */}
      {(result || error) && (
        <div style={overlayStyle} onClick={() => { setResult(null); setError(null); }}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            {error ? (
              <>
                <div style={{ ...modalHeaderStyle, borderColor: '#f43f5e' }}>
                  <span style={{ color: '#f43f5e' }}>✕ Connection Error</span>
                </div>
                <p style={modalBodyStyle}>{error}</p>
                <p style={{ ...modalBodyStyle, color: '#475569', fontSize: 11 }}>
                  Make sure the backend is running: <code style={codeStyle}>uvicorn main:app --reload</code>
                </p>
              </>
            ) : (
              <>
                <div style={{ ...modalHeaderStyle, borderColor: result.is_dag ? '#10b981' : '#f59e0b' }}>
                  <span style={{ color: result.is_dag ? '#10b981' : '#f59e0b' }}>
                    {result.is_dag ? '✓ Valid DAG' : '⚠ Cycle Detected'}
                  </span>
                </div>
                <div style={metricsStyle}>
                  <Metric label="Nodes" value={result.num_nodes} color="#10b981" />
                  <Metric label="Edges" value={result.num_edges} color="#6366f1" />
                  <Metric
                    label="Is DAG"
                    value={result.is_dag ? 'Yes' : 'No'}
                    color={result.is_dag ? '#10b981' : '#f59e0b'}
                  />
                </div>
                <p style={{ ...modalBodyStyle, color: '#475569', fontSize: 11, marginTop: 12 }}>
                  {result.is_dag
                    ? 'Pipeline has no cycles — safe to execute.'
                    : 'Pipeline contains a cycle. Fix circular connections before execution.'}
                </p>
              </>
            )}
            <button style={closeBtnStyle} onClick={() => { setResult(null); setError(null); }}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const Chip = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#64748b', fontFamily: 'var(--font-body)' }}>
    <span style={{ color, fontWeight: 700, fontSize: 14 }}>{value}</span>
    <span style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
  </div>
);

const Metric = ({ label, value, color }) => (
  <div style={{
    flex: 1,
    textAlign: 'center',
    padding: '12px 8px',
    background: `${color}0d`,
    border: `1px solid ${color}33`,
    borderRadius: 8,
  }}>
    <div style={{ fontSize: 24, fontWeight: 700, color, fontFamily: 'var(--font-body)' }}>{value}</div>
    <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 4 }}>{label}</div>
  </div>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const barStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-8) var(--space-11)',
  background: '#080c12',
  borderTop: '1px solid #1e2535',
};

const statsStyle = {
  display: 'flex',
  gap: 20,
};

const btnStyle = {
  background: '#6366f1',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  padding: 'var(--space-6) var(--space-10)',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'var(--font-body)',
  letterSpacing: '0.04em',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  transition: 'background 0.15s',
};

const btnDisabledStyle = {
  opacity: 0.6,
  cursor: 'not-allowed',
};

const spinnerStyle = {
  display: 'inline-block',
  animation: 'spin 1s linear infinite',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const modalStyle = {
  background: '#0f1117',
  border: '1px solid #1e2535',
  borderRadius: 12,
  padding: 'var(--space-11)',
  minWidth: 340,
  maxWidth: 420,
  boxShadow: '0 24px 80px rgba(0,0,0,0.8)',
  fontFamily: 'var(--font-body)',
};

const modalHeaderStyle = {
  fontSize: 15,
  fontWeight: 700,
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid #1e2535',
};

const modalBodyStyle = {
  fontSize: 12,
  color: '#94a3b8',
  lineHeight: 1.6,
  margin: 0,
};

const metricsStyle = {
  display: 'flex',
  gap: 10,
};

const closeBtnStyle = {
  marginTop: 18,
  width: '100%',
  background: '#1a2030',
  border: '1px solid #2a3448',
  borderRadius: 7,
  color: '#94a3b8',
  fontSize: 12,
  fontWeight: 600,
  fontFamily: 'var(--font-body)',
  padding: 'var(--space-6) 0',
  cursor: 'pointer',
  letterSpacing: '0.04em',
};

const codeStyle = {
  background: '#1a2030',
  padding: '1px 5px',
  borderRadius: 4,
  fontSize: 10,
  color: '#06b6d4',
};